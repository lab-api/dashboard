import React from 'react';
import ReactDOM from 'react-dom';
import Collapsible from './Collapsible.jsx'
import { ParameterTable, SwitchTable } from './ParameterTable.jsx'
import Divider from '@material-ui/core/Divider';
import ButtonAppBar from './TopBar.jsx'


function renderAppend(element, container) {
  // Creates a new div within the container and renders the passed element
  var target = document.createElement('row')
  container.appendChild(target)
  ReactDOM.render(element, target)
}

function createData(name, value) {
  return { name, value };
}

function get_table_data(dict) {
  const table_parameters = []
  const table_switches = []
  for (var inst_key in dict) {
    var val = dict[inst_key]
    if (typeof(val)=='number'){
      table_parameters.push(createData(inst_key, dict[inst_key]))
    }
    else if (typeof(val)=='boolean') {
      table_switches.push(createData(inst_key, dict[inst_key]))
    }
  }

  return [table_parameters, table_switches]
}

export function createWidgets(parameters) {
  var appBar = ButtonAppBar()
  ReactDOM.render(appBar, document.getElementById('top-bar'))

  for (var key in parameters) {
    var value = parameters[key]
    if (typeof(value) == "number"){
      // var container = document.getElementById('parameters')
      // var element = <Widget name={key} value={value} prefix="/parameters/" />
      // renderAppend(element,container);
    }
    else if (typeof(parameters[key]) == 'boolean') {
      // make_switch(key, parameters[key], container=document.getElementById('parameters'))
    }
    else if (typeof(value) == 'object') {
      var instrument_parameters = parameters[key]
      var prefix = `/instruments/${key}/parameters/`

      var id1 = key.concat('Collapsible1')
      var id2 = key.concat('Collapsible2')

      var panel = Collapsible(key, id1, id2)
      renderAppend(panel, document.getElementById("parameters"))
      renderAppend(<Divider />, document.getElementById("parameters"))
      var details1 = document.getElementById(id1)
      var details2 = document.getElementById(id2)

      // make ParameterTable
      const [table_parameters, table_switches] = get_table_data(instrument_parameters)
      var parameter_table = ParameterTable(table_parameters, key)
      renderAppend(parameter_table, details1)
      var switch_table = SwitchTable(table_switches, key)
      renderAppend(switch_table, details2)


    }
  }
}
