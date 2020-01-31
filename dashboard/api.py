from flask import Flask, request, render_template
import requests
import json
import importlib, inspect
from parametric import Parameter, Attribute, Instrument
import attr
from threading import Thread

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

    def shutdown_server(self):
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()

    @staticmethod
    def search(type_, namespace, return_dict=False):
        ''' Returns all instances of a passed type in the dictionary. If no namespace is passed, search in globals(). '''
        instances = []
        for x in namespace.keys():
            if isinstance(namespace[x], type_):
                instances.append(namespace[x])

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
            return "Parametric API"

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
            return render_template('instruments.html', instrument=instrument, parameters=list(inst.parameters.keys()))


        @app.route("/instruments/<instrument>/parameters/<parameter>/get", methods=['GET'])
        def get_instrument_parameter(instrument, parameter):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = inst.parameters[parameter]

            return str(param.get())

        @app.route("/instruments/<instrument>/parameters/<parameter>/set/<value>", methods=['GET'])
        def set_instrument_parameter(instrument, parameter, value):
            inst = self.search(Instrument, self.namespace, return_dict=True)[instrument]
            param = inst.parameters[parameter]
            param.set(float(value))

            return ''

        ''' Parameter endpoints '''
        @app.route("/parameters", methods=['GET'])
        def list_parameters():
            params = self.search(Parameter, self.namespace)
            names = [param.name for param in params]
            print(names)
            return render_template('parameters.html', names=names)

        @app.route("/parameters/<parameter>", methods=['GET'])
        def parameter_page(parameter):
            # param = self.search(Parameter, self.namespace, return_dict=True)[parameter]
            return render_template('parameters.html', names=[parameter])

        @app.route("/parameters/<parameter>/set/<value>", methods=['GET'])
        def set_parameter(parameter, value):
            param = self.search(Parameter, self.namespace, return_dict=True)[parameter]
            param.set(float(value))

            return ''

        @app.route("/parameters/<parameter>/get", methods=['GET'])
        def get_parameter(parameter):
            param = self.search(Parameter, self.namespace, return_dict=True)[parameter]
            return str(param.get())

        app.run(host=self.addr, port=self.port, debug=self.debug, threaded=False)
