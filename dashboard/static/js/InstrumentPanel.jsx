import React from 'react';
import ReactDOM from 'react-dom';
import Collapsible from './Collapsible.jsx'
import ParameterTable from './ParameterTable.jsx'
import SwitchTable from './SwitchTable.jsx'

export default function InstrumentPanel(props){
  const parameter_table = <ParameterTable instrument={props.instrument} />
  const switch_table = <SwitchTable instrument={props.instrument} />
  return (
    <Collapsible name={props.instrument} left={parameter_table} right={switch_table} />
  )
}
