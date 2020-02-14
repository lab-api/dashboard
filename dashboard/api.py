from flask import Flask, request, render_template
import requests
import json
import importlib, inspect
from parametric import Parameter, Instrument
from parametric.factory import Knob, Switch, Measurement, Selector
import attr
from threading import Thread
from optimistic.algorithms import *
from flask_socketio import SocketIO
from functools import partial

class API:
    def __init__(self, namespace, addr='127.0.0.1', port=8000, debug=False):
        self.addr = addr
        self.port = port
        self.namespace = namespace
        self.debug = debug
        self.results = {}

    def get(self, endpoint):
        if endpoint[0] == '/':
            endpoint = endpoint[1:]
        text = requests.get(f'http://{self.addr}:{self.port}/{endpoint}').text
        try:
            text = json.loads(text)
        except json.JSONDecodeError:
            pass
        return text

    def post(self, endpoint, payload):
        ''' POST a json-compatible payload to an endpoint '''
        if endpoint[0] == '/':
            endpoint = endpoint[1:]
        response = requests.post(f'http://{self.addr}:{self.port}/{endpoint}', json=payload)
        return json.loads(response.text)

    def shutdown_server(self):
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()

    @staticmethod
    def search(type_, namespace, return_dict=False, name=None):
        ''' Returns all instances of a passed type in the dictionary. If no namespace is passed, search in globals(). '''
        instances = []
        for x in namespace.keys():
            if isinstance(namespace[x], type_):
                instances.append(namespace[x])

        if name is not None:
            for i in instances:
                if i.name == name:
                    return i
        if return_dict:
            d = {}
            for x in instances:
                d[x.name] = x
            return d
        return instances

    def run(self):
        self.thread = Thread(target=self.serve)
        self.thread.start()

    def serve(self):
        app = Flask(__name__)
        socketio = SocketIO(app)

        def emit_parameter_update(id, value):
            socketio.emit('parameter', {'id': id,
                                        'value': value})

        def prepare_state(state=None, namespace=None, parent_id=None, return_handle=False):
            ''' Recursively search through instruments and prepare a flattened state
                First pass: look for parameters in the current namespace and add them to the state;
                            then, iterate through all instruments
                Second pass: look for parameters in each instrument namespace, then iterate through all instruments '''
            if namespace is None:
                namespace = self.namespace
            if state is None:
                state = {'knobs': {}, 'switches': {}, 'selectors': {}, 'measurements': {}, 'instruments': {}}

            ''' Search parameters within namespace '''
            for child in self.search(Parameter, namespace, return_dict=True).values():
                if isinstance(child, Knob):
                    id = str(len(state['knobs']))
                    entry = {'name': child.name,
                             'value': child.get(),
                             'instrument': parent_id,
                             'min': child.bounds[0],
                             'max': child.bounds[1]}
                    if return_handle:
                        entry['handle'] = child
                    state['knobs'][id] = entry
                    state['instruments'][parent_id]['knobs'].append(id)
                    child.callbacks['api'] = partial(emit_parameter_update, id)

                elif isinstance(child, Switch):
                    id = str(len(state['switches']))
                    entry = {'name': child.name, 'value': child.get(), 'instrument': parent_id}
                    if return_handle:
                        entry['handle'] = child
                    state['switches'][id] = entry
                    state['instruments'][parent_id]['switches'].append(id)

                elif isinstance(child, Measurement):
                    id = str(len(state['measurements']))
                    entry = {'name': child.name, 'instrument': parent_id}
                    if return_handle:
                        entry['handle'] = child
                    state['measurements'][id] = entry
                    state['instruments'][parent_id]['measurements'].append(id)

                elif isinstance(child, Selector):
                    id = str(len(state['selectors']))
                    entry = {'name': child.name,
                             'value': child.get(),
                             'instrument': parent_id,
                             'options': child.options}
                    if return_handle:
                        entry['handle'] = child
                    state['selectors'][id] = entry
                    state['instruments'][parent_id]['selectors'].append(id)

            ''' Search instruments '''
            for instrument in self.search(Instrument, namespace, return_dict=True).values():
                instrument_entry = {'name': instrument.name,
                                    'children': [],
                                    'switches': [],
                                    'selectors': [],
                                    'knobs': [],
                                    'measurements': [],
                                    'parent': None}
                instrument_id = str(len(state['instruments']))

                if parent_id is not None:
                    state['instruments'][parent_id]['children'].append(instrument_id)
                    instrument_entry['parent'] = parent_id
                if return_handle:
                    instrument_entry['handle'] = instrument
                state['instruments'][instrument_id] = instrument_entry

                state = prepare_state(state,
                                      namespace = instrument.__dict__,
                                      parent_id = instrument_id,
                                      return_handle = return_handle)
            return state

        @app.route("/")
        def hello():
            frontend_state = prepare_state()
            self.state = prepare_state(return_handle=True)
            return render_template('index.html', state=frontend_state)

        @app.route("/selectors/<id>/set/<value>")
        def set_selector(id, value):
            parameter = self.state['selectors'][id]['handle']
            parameter.set(value)
            return ''

        @app.route("/selectors/<id>/get")
        def get_selector(id):
            parameter = self.state['selectors'][id]['handle']
            return json.dumps(parameter.get())

        @app.route("/switches/<id>/set/<value>")
        def set_switch(id, value):
            parameter = self.state['switches'][id]['handle']
            parameter.set(bool(int(value)))
            print('switch', id, 'set to', parameter.get())
            return ''

        @app.route("/switches/<id>/get")
        def get_switch(id):
            parameter = self.state['switches'][id]['handle']
            return json.dumps(int(parameter.get()))

        @app.route("/knobs/<id>/get")
        def get_knob(id):
            parameter = self.state['knobs'][id]['handle']
            return json.dumps(parameter.get())

        @app.route("/knobs/<id>/set/<value>")
        def set_knob(id, value):
            parameter = self.state['knobs'][id]['handle']
            parameter.set(float(value))

            return ''

        @app.route("/measurements/<id>/get")
        def get_measurement(id):
            parameter = self.state['measurements'][id]['handle']
            return json.dumps(parameter.get())

        @app.route('/shutdown', methods=['GET'])
        def shutdown():
            self.shutdown_server()
            return 'Server shutting down...'

        ''' Optimistic endpoints '''
        from importlib import import_module
        from inspect import isclass

        @app.route('/optimistic/algorithms')
        def list_algorithms():
            module = import_module('optimistic.algorithms')
            names = []
            for a in dir(module):
                if '__' not in a:
                    inst = getattr(module, a)
                    if isclass(inst):
                        names.append(a)
            names.remove('Algorithm')
            return json.dumps(names)

        @app.route('/optimistic/algorithms/<algorithm>/parameters')
        def list_algorithm_parameters(algorithm):
            module = import_module('optimistic.algorithms')
            inst = getattr(module, algorithm)()
            parameters = self.search(Parameter, inst.__dict__)
            d = {}
            for p in parameters:
                d[p.name] = p.value
            return json.dumps(d)

        @app.route('/optimistic/submit', methods=['POST'])
        def submit_run():
            ''' Takes a dictionary of the following field structure (example)
                shown for the GradientDescent algorithm):
                submission = {'algorithm': 'GradientDescent',
                              'settings': {'learning_rate': 1e-2},
                              'bounds': {'instrument': {'x': {'min': 0, 'max': 1}}},
                              'parameters': {'instrument': ['x']},
                              'instrument': 'instrument'
                              'objective': 'z'}
                where x and z are Parameters.

                Returns a dictionary with fields listing measurements
             '''
            submission = request.json
            print(submission)
            module = import_module('optimistic.algorithms')
            algo_class = getattr(module, submission['algorithm'])

            objective = self.state['measurements'][submission['objective']]['handle']
            algo = algo_class(objective, **submission['settings'])

            for id in submission['parameters']:
                parameter = self.state['knobs'][id]['handle']
                bounds = submission['bounds'][id]
                bounds = (bounds['min'], bounds['max'])
                algo.add_parameter(parameter, bounds=bounds)

            algo.run()
            print(algo.X, algo.y)
            data = {}
            for col in algo.dataset.columns:
                data[col] = list(algo.dataset[col].values)

            self.results[str(len(self.results))] = algo.dataset
            return json.dumps(data)

        @app.route('/optimistic/results')
        def list_results():
            return json.dumps(list(self.results.keys()))

        @app.route('/optimistic/results/<id>')
        def retrieve_results(id):
            data = {}
            dataset = self.results[id]
            columns = [{'width': 250, 'label': x, 'dataKey': x} for x in dataset.columns]
            records = dataset.to_json(orient='records')

            return json.dumps({'columns': columns, 'records': records})

        socketio.run(app, host=self.addr, port=self.port, debug=self.debug)
