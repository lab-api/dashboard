from flask import Flask, request, render_template
import requests
import json
import importlib, inspect
from parametric import Parameter, Instrument
from parametric.factory import Knob, Switch, Measurement, Selector
from vigilant import Monitor
import attr
from threading import Thread
from optimistic.algorithms import *
from flask_socketio import SocketIO
from functools import partial
import uuid

class API:
    def __init__(self, namespace, addr='127.0.0.1', port=8000, debug=False):
        self.addr = addr
        self.port = port
        self.namespace = namespace
        self.debug = debug
        self.connected = False

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
        socketio = SocketIO(app, async_mode="threading")

        @socketio.on("connect")
        def connect():
            self.connected = True

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



        def find_monitors(state):
            def callback(entry, value):
                if not self.connected:
                    print('waiting for connection')
                    return
                id = entry['id']
                update = {}
                for col in value:
                    col_id = entry['observers'][col]
                    update[col_id] = value[col].iloc[0]
                socketio.emit('monitor', {'id': id, 'values': update})

            state['monitors'] = {}
            state['observers'] = {}
            for monitor in self.search(Monitor, self.namespace, return_dict=True).values():
                monitor_entry = {'name': monitor.name, 'observers': {}, 'id': str(uuid.uuid4())}
                for name, observer in monitor.observers.items():
                    id = str(uuid.uuid4())
                    monitor_entry['observers'][name] = id
                    state['observers'][id] = {'name': name,
                                              'value': '',
                                              'data': [],
                                              'bounds': observer.threshold}
                state['monitors'][monitor_entry['id']] = monitor_entry
                monitor.callbacks.append(partial(callback, monitor_entry))

            return state

        @app.route("/")
        def hello():
            frontend_state = prepare_state()
            frontend_state = find_monitors(frontend_state)

            self.state = prepare_state(return_handle=True)
            app.config['state'] = self.state
            app.config['results'] = {}
            return render_template('index.html', state=frontend_state)

        ''' Optimistic endpoints '''
        from .parameters import parameters
        app.register_blueprint(parameters, url_prefix='/')

        ''' Optimistic endpoints '''
        from .optimization import optimization
        app.register_blueprint(optimization, url_prefix='/optimistic')

        socketio.run(app, host=self.addr, port=self.port, debug=self.debug)
