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
import SendIcon from "@material-ui/icons/Send";
import { get } from '../utilities.js'

function ParameterRows(props) {
  const handleClick = (id) => {
    props.dispatch(actions.checked.toggle(id))
  };
  const knobIDs = props.instruments[props.instrumentID].knobs
  const [buttonsVisible, setButtonsVisible] = React.useState('')

  function send(event, id) {
    event.stopPropagation()
    if (props.ui[id]['error']) {
      const parameter = props.knobs[id]
      const instrument_name = props.instruments[parameter.instrument].name
      const full_name = instrument_name + ' ' + parameter.name
      const bounds_string = `[${parameter.min}, ${parameter.max}]`
      const alert = 'ERROR: Valid bounds for ' + full_name + ' are ' + bounds_string + "."
      props.dispatch(actions.alert.show(alert, 'error'))

      return
    }
    const value = props.ui[id]['buffer']
    const url = '/knobs/' + id + '/set/' + value
    get(url)
    }

    function refresh(event, id) {
        event.stopPropagation()
        const url = '/knobs/' + id + '/get'
        get(url, (value) => {
          props.dispatch(actions.knobs.update(id, value))
          props.dispatch(actions.ui.patch('knobs', id, 'display', ''))
        })
    }

  return (
    <React.Fragment>
      {knobIDs.map((id, i) => (
      <TableRow key={id} hover
                         onClick={event => handleClick(id)}
                         onMouseEnter={() => setButtonsVisible(id)}
                         onMouseLeave={() => setButtonsVisible('')}
                         >
        <TableCell padding="checkbox">
          <Checkbox checked={props.checked.includes(id)}/>
        </TableCell>
        <TableCell>{props.knobs[id].name}</TableCell>
        <TableCell>
          <ValidatedInput defaultValue={props.knobs[id].value}
                       feature={'knobs'}
                       instrument={props.instruments[props.instrumentID].name}
                       parameter={props.knobs[id].name}
                       min={props.knobs[id].min}
                       max={props.knobs[id].max}
                       knobID={id}
          />
        </TableCell>
        <TableCell align="left" padding="checkbox">
          {buttonsVisible == id? (
          <div className="row">
          <IconButton aria-label="update" onClick={(event) => send(event, id)}>
            <SendIcon />
          </IconButton>
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
          knobs: state['knobs'],
          instruments: state['instruments'],
          ui: state['ui']['knobs']
        }
}

export default connect(mapStateToProps)(ParameterRows)
