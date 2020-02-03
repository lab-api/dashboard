import React from 'react';
import ReactDOM from 'react-dom';
import Collapsible from './Collapsible.jsx'
import ParameterTable from './ParameterTable.jsx'
import SwitchTable from './SwitchTable.jsx'

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

export default function InstrumentPanel(props){
  const [table_parameters, table_switches] = get_table_data(props.parameters[props.instrument])
  const parameter_table = <ParameterTable rows={table_parameters} instrument={props.instrument} />
  const switch_table = <SwitchTable switches={table_switches} instrument={props.instrument} />
  return (
    <Collapsible name={props.instrument} left={parameter_table} right={switch_table} />
  )
}
