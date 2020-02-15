from importlib import import_module
from inspect import isclass
from flask import Blueprint, request, current_app
import json
from .api import API
from parametric import Parameter

optimization = Blueprint('optimistic', __name__)

@optimization.route('/algorithms')
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

@optimization.route('/algorithms/<algorithm>/parameters')
def list_algorithm_parameters(algorithm):
    module = import_module('optimistic.algorithms')
    inst = getattr(module, algorithm)()
    parameters = API.search(Parameter, inst.__dict__)
    d = {}
    for p in parameters:
        d[p.name] = p.value
    return json.dumps(d)

@optimization.route('/submit', methods=['POST'])
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

    objective = current_app.config['state']['measurements'][submission['objective']]['handle']
    algo = algo_class(objective, **submission['settings'])

    for id in submission['parameters']:
        parameter = current_app.config['state']['knobs'][id]['handle']
        bounds = submission['bounds'][id]
        bounds = (bounds['min'], bounds['max'])
        algo.add_parameter(parameter, bounds=bounds)

    algo.run()
    print(algo.X, algo.y)
    data = {}
    for col in algo.dataset.columns:
        data[col] = list(algo.dataset[col].values)

    current_app.config['results'][str(len(current_app.config['results']))] = algo.dataset
    return json.dumps(data)

@optimization.route('/results')
def list_results():
    return json.dumps(list(current_app.config['results'].keys()))

@optimization.route('/results/<id>')
def retrieve_results(id):
    data = {}
    dataset = current_app.config['results'][id]
    columns = [{'width': 250, 'label': x, 'dataKey': x} for x in dataset.columns]
    records = dataset.to_json(orient='records')

    return json.dumps({'columns': columns, 'records': records})
