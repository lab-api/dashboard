from importlib import import_module
from inspect import isclass
from flask import Blueprint, request, current_app
import json
from .api import API
from parametric import Parameter

parameters = Blueprint('parametric', __name__)

@parameters.route("/selectors/<id>", methods=['GET', 'POST'])
def selector(id):
    parameter = current_app.config['state']['selectors'][id]['handle']
    if request.method == 'POST':
        parameter.set(request.json['value'])
        return ''
    elif request.method == 'GET':
        return json.dumps(parameter.get())

@parameters.route("/switches/<id>", methods=['GET', 'POST'])
def switch(id):
    parameter = current_app.config['state']['switches'][id]['handle']
    if request.method == 'POST':
        parameter.set(bool(int(request.json['value'])))
        return ''
    elif request.method == 'GET':
        return json.dumps(int(parameter.get()))

@parameters.route("/knobs/<id>", methods=['GET', 'POST'])
def knob(id):
    parameter = current_app.config['state']['knobs'][id]['handle']
    if request.method == 'POST':
        parameter.set(float(request.json['value']))
        return ''
    elif request.method == 'GET':
        return json.dumps(parameter.get())

@parameters.route("/measurements/<id>")
def measurement(id):
    parameter = current_app.config['state']['measurements'][id]['handle']
    return json.dumps(parameter.get())
