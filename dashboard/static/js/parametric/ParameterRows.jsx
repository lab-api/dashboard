import React from 'react';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import Checkbox from "@material-ui/core/Checkbox";
import ValidatedInput from '../components/ValidatedInput.jsx'

function ParameterRows(props) {
  const handleClick = (event, name) => {
    props.dispatch(actions.checked.toggle(props.instrument, name))
  };

  return (
    <React.Fragment>
      {Object.keys(props.parameters).map((parameter, i) => (
      <TableRow key={parameter} hover onClick={event => handleClick(event, parameter)}>
        <TableCell padding="checkbox">
          <Checkbox checked={props.checked.includes(parameter)}/>
        </TableCell>
        <TableCell>{parameter}</TableCell>
        <TableCell>
          <ValidatedInput defaultValue={props.parameters[parameter]}
                       id={'parameters'}
                       instrument={props.instrument}
                       parameter={parameter}
                       min={props.bounds[parameter]['min']}
                       max={props.bounds[parameter]['max']}
          />
        </TableCell>
        <TableCell/>
        <TableCell/>
      </TableRow>
    ))}
    </React.Fragment>
  )
}

function mapStateToProps(state, ownProps){
  return {parameters: state['parameters'][ownProps['instrument']],
          checked: state['checked'][ownProps['instrument']],
          bounds: state['bounds'][ownProps['instrument']]
        }
}

export default connect(mapStateToProps)(ParameterRows)
