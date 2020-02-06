from flask import Flask, request, render_template
import requests
import json
import importlib, inspect
from parametric import Parameter, Attribute, Instrument
import attr
from threading import Thread

from optimistic.algorithms import *

class API:
    def __init__(self, namespace, addr='127.0.0.1', port=54031, debug=False):
        self.addr = addr
        self.port = port
        self.namespace = namespace
        self.debug = debug

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
    def search(type_, namespace, return_dict=False, name=None, kind=None):
        ''' Returns all instances of a passed type in the dictionary. If no namespace is passed, search in globals(). '''
        instances = []
        for x in namespace.keys():
            if isinstance(namespace[x], type_):
                if kind is not None and namespace[x].kind != kind:
                    continue
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

        @app.route("/")
        def hello():
            d = {}
            for inst in self.search(Instrument, self.namespace, return_dict=True).values():
                d[inst.name] = {'knob': {}, 'switch': {}, 'measurement': {}}

                for p in self.search(Parameter, inst.__dict__, return_dict=True).values():
                    if p.kind == 'measurement':
                        d[inst.name][p.kind][p.name] = ''
                    else:
                        d[inst.name][p.kind][p.name] = {'value': p.get(), 'min': p.bounds[0], 'max': p.bounds[1]}


            return render_template('parameters.html', parameters=d)

        @app.route('/shutdown', methods=['GET'])
        def shutdown():
            self.shutdown_server()
            return 'Server shutting down...'

        ''' Instrument endpoints '''
        @app.route("/instruments", methods=['GET'])
        def list_instruments():
            instruments = self.search(Instrument, self.namespace)
            names = [inst.name for inst in instruments]
            return json.dumps(names)

        @app.route("/instruments/<instrument>/parameters", methods=['GET'])
        def list_instrument_parameters(instrument):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            params = self.search(Parameter, inst.__dict__)
            d = {}
            for p in params:
                d[p.name] = p()
            d = {instrument: d}
            return render_template('parameters.html', parameters=d)


        @app.route("/instruments/<instrument>/parameters/<parameter>/get", methods=['GET'])
        def get_instrument_parameter(instrument, parameter):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = self.search(Parameter, inst.__dict__, return_dict=True)[parameter]
            return str(param.get())

        @app.route("/instruments/<instrument>/parameters/<parameter>/set/<value>", methods=['GET'])
        def set_instrument_parameter(instrument, parameter, value):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = self.search(Parameter, inst.__dict__, return_dict=True)[parameter]
            param.set(float(value))

            return ''

        @app.route("/instruments/<instrument>/switches/<parameter>/get", methods=['GET'])
        def get_instrument_switch(instrument, parameter):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = self.search(Parameter, inst.__dict__, return_dict=True, kind='switch')[parameter]
            return str(param.get())

        @app.route("/instruments/<instrument>/switches/<parameter>/set/<value>", methods=['GET'])
        def set_instrument_switch(instrument, parameter, value):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = self.search(Parameter, inst.__dict__, return_dict=True, kind='switch')[parameter]
            param.set(value=='true')

            return ''

        ''' Parameter endpoints '''
        @app.route("/parameters", methods=['GET'])
        def list_parameters():
            params = self.search(Parameter, self.namespace)
            d = {}
            for p in params:
                d[p.name] = p()
            return render_template('parameters.html', parameters=d)

        @app.route("/parameters/<parameter>/set/<value>", methods=['GET'])
        def set_parameter(parameter, value):
            param = self.search(Parameter, self.namespace, return_dict=True)[parameter]
            param.set(float(value))

            return ''

        @app.route("/parameters/<parameter>/get", methods=['GET'])
        def get_parameter(parameter):
            param = self.search(Parameter, self.namespace, return_dict=True)[parameter]
            return str(param.get())


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
            instrument = self.search(Instrument, self.namespace, name=submission['instrument'])
            objective = self.search(Parameter, instrument.__dict__, name=submission['objective'])
            algo = algo_class(objective, **submission['settings'])
            for instrument in submission['parameters']:
                instance = self.search(Instrument, self.namespace, name=instrument)
                for p in submission['parameters'][instrument]:
                    parameter = self.search(Parameter, instance.__dict__, name=p)
                    bounds = submission['bounds'][instrument][p]
                    bounds = (bounds['min'], bounds['max'])
                    algo.add_parameter(parameter, bounds=bounds)

            algo.run()
            print(algo.X, algo.y)
            data = {}
            for col in algo.dataset.columns:
                data[col] = list(algo.dataset[col].values)

            return json.dumps(data)

        app.run(host=self.addr, port=self.port, debug=self.debug, threaded=False)
