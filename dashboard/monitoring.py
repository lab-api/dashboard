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
    state['observers'].append(id)

    measurement = state['measurements'][id]['handle']
    path = state['measurements'][id]['path']
    category = path.split('/')[0]
    rest = path.split(category+'/')[1]

    monitor.watch(measurement, category=category, threshold=measurement.bounds)

    return id


@monitoring.route("/unwatch", methods=['POST'])
def monitor_unwatch():
    monitor = current_app.config['monitor']
    state = current_app.config['state']
    id = request.json['id']

    state['observers'].remove(id)
    path = state['measurements'][id]['path']
    category = path.split('/')[0]
    rest = path.split(category+'/')[1]
    del monitor.categories[category][path]

    return id
