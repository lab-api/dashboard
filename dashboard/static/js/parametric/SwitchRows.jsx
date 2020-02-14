import React from 'react';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import Checkbox from "@material-ui/core/Checkbox";
import ValidatedInput from '../components/ValidatedInput.jsx'
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from "@material-ui/icons/Cached";
import { get } from '../utilities.js'
import Switch from '@material-ui/core/Switch';

function SwitchRows(props) {
  const knobIDs = props.instruments[props.instrumentID].switches
  const [buttonsVisible, setButtonsVisible] = React.useState('')

    function refresh(event, id) {
        event.stopPropagation()
        const url = '/switches/' + id + '/get'
        get(url, (value) => {
          props.dispatch(actions.switches.update(id, value))
        })
    }

  function handleToggle(event, id) {
    event.stopPropagation()
    const newState = 1 - props.switches[id].value
    const url = '/switches/' + id + '/set/' +  newState
    props.dispatch(actions.switches.update(id, newState))
    get(url)
  }

  return (
    <React.Fragment>
      {knobIDs.map((id, i) => (
      <TableRow key={id} hover
                         onMouseEnter={() => setButtonsVisible(id)}
                         onMouseLeave={() => setButtonsVisible('')}
                         >
        <TableCell padding="checkbox">
        </TableCell>
        <TableCell>{props.switches[id].name}</TableCell>
        <TableCell>
          <Switch
            checked={props.switches[id].value}
            onChange={(event) => handleToggle(event, id)}
          />
        </TableCell>
        <TableCell align="left" padding="checkbox">
          {buttonsVisible == id? (
          <div className="row">
          <IconButton aria-label="refresh" onClick={(event) => refresh(event, id)}>
            <CachedIcon />
          </IconButton>
          </div>
        ): null }
        </TableCell>
        <TableCell/>
      </TableRow>
    ))}
    </React.Fragment>
  )
}

function mapStateToProps(state, ownProps){
  return {checked: state['checked'],
          switches: state['switches'],
          instruments: state['instruments']
        }
}

export default connect(mapStateToProps)(SwitchRows)
