from flask import Blueprint, request, current_app
import json
import uuid
import numpy as np

monitoring = Blueprint('monitoring', __name__)

@monitoring.route("/status", methods=['POST'])
def monitor_status():
    monitor = current_app.config['monitor']
    op = request.json['operation']
    if op == 'stop':
        monitor.stop()
    elif op == 'start':
        monitor.start()

    return ''

@monitoring.route("/watch", methods=['POST'])
def monitor_watch():
    monitor = current_app.config['monitor']
    state = current_app.config['state']
    id = request.json['id']
    measurement = state['measurements'][id]['handle']
    monitor.watch(measurement, threshold=measurement.bounds)
    monitor.observers[measurement.name].id = id
    ''' Add observer to state '''
    state['observers'][id] = {'name': measurement.name,
                              'value': '',
                              'data': [],
                              'bounds': measurement.bounds,
                              'id': id
                              }

    return json.dumps(state['observers'][id])


@monitoring.route("/unwatch", methods=['POST'])
def monitor_unwatch():
    monitor = current_app.config['monitor']
    state = current_app.config['state']
    id = request.json['id']
    del monitor.observers[state['measurements'][id]['name']]

    return ''
