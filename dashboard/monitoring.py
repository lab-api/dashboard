from importlib import import_module
from inspect import isclass
from flask import Blueprint, request, current_app
import json
from .api import API
from parametric import Parameter

monitoring = Blueprint('monitoring', __name__)

@parameters.route("/selectors/<id>", methods=['GET', 'POST'])
def selector(id):
    parameter = current_app.config['state']['selectors'][id]['handle']
    if request.method == 'POST':
        parameter.set(request.json['value'])
        return ''
    elif request.method == 'GET':
        return json.dumps(parameter.get())
