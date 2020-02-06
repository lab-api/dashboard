import React from 'react';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import Checkbox from "@material-ui/core/Checkbox";
import Input from '@material-ui/core/Input';

function ParameterRows(props) {
  const handleClick = (event, name) => {
    props.dispatch(actions.checked.toggle(props.instrument, name))
  };

  function handleUserInput(instrument, parameter, value) {
    props.dispatch(actions.updateInput(instrument, parameter, value))
  }
  return (
    <React.Fragment>
      {Object.keys(props.parameters).map((parameter, i) => (
      <TableRow key={parameter} hover onClick={event => handleClick(event, parameter)}>
        <TableCell padding="checkbox">
          <Checkbox checked={props.checked.includes(parameter)}/>
        </TableCell>
        <TableCell>{parameter}</TableCell>
        <TableCell>
          <Input placeholder={props.parameters[parameter].toString()}
                 value={props.inputs[parameter]}
                 id={props.instrument.concat('-', parameter, '-text')}
                 onChange={(event)=>handleUserInput(props.instrument, parameter, event.target.value)}/>
        </TableCell>
        <TableCell/>
      </TableRow>
    ))}
    </React.Fragment>
  )
}

function mapStateToProps(state, ownProps){
  return {parameters: state['parameters'][ownProps['instrument']],
          checked: state['checked'][ownProps['instrument']],
          inputs: state['inputs'][ownProps['instrument']]
        }
}

export default connect(mapStateToProps)(ParameterRows)
