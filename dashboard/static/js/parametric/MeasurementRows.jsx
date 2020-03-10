import React from 'react';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import Checkbox from "@material-ui/core/Checkbox";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import { get, post } from '../utilities.js'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

function MeasurementRows(props) {
  const [buttonsVisible, setButtonsVisible] = React.useState('')

  const ids = props.instruments[props.instrumentID].measurements
  function selectMeasurement(id) {
    if (props.optimization['objective'] != id) {
      props.dispatch(actions.ui.optimization.put('objective', id))
    }
    else {
      props.dispatch(actions.ui.optimization.put('objective', ''))

    }
  }

  function toggle_watch(event, id) {
    event.stopPropagation()
    if (id in props.observers) {
      unwatch(id)
    }
    else {
      watch(id)
    }
  }

  function watch(id) {
    post('/monitor/watch', {'id': id}, (entry) => {
      if (typeof(entry) == 'string') {
        entry = JSON.parse(entry)
      }
      props.dispatch(actions.observers.add(entry['id'], entry))
    })
  }

  function unwatch(id) {
    post('/monitor/unwatch', {'id': id}, () => {
      props.dispatch(actions.observers.remove(id))
    })

  }

  function measureResult(event, id) {
    event.preventDefault()
    event.stopPropagation()
    get('/measurements/' + id, (result) => {
      const name = props.measurements[id].name
      const successText = 'Measurement of ' + name + ' complete. Result: ' + result
      props.dispatch(actions.alert.show(successText, 'success'))

    }
  )
  }

  return (
    <React.Fragment>
      {ids.map((id, i) => (
      <TableRow key={id}
                hover
                onClick={()=>selectMeasurement(id)}
                style={(props.optimization['objective'] == id)? {background: "#4a7a8a"}: {background: null}}
                onMouseEnter={() => setButtonsVisible(id)}
                onMouseLeave={() => setButtonsVisible('')}
                >
        <TableCell padding="checkbox">
        </TableCell>
        <TableCell>{props.measurements[id].name}</TableCell>
        <TableCell>
        </TableCell>
        <TableCell align="left" padding="checkbox">
          {buttonsVisible == id? (
          <div className='row'>
            <IconButton aria-label="refresh"  onClick={(event)=>measureResult(event, id)}>
              <PlayArrowIcon />
            </IconButton>
            <IconButton aria-label="watch" onClick={(event) => toggle_watch(event, id)}>
              {id in props.observers? <VisibilityIcon />: <VisibilityOffIcon/>}
            </IconButton>
          </div>
        ): null
        }
        </TableCell>
        <TableCell/>
      </TableRow>
    ))}
    </React.Fragment>
  )
}

function mapStateToProps(state, ownProps){
  return {checked: state['checked'],
          measurements: state['measurements'],
          instruments: state['instruments'],
          optimization: state['ui']['optimization'],
          observers: state['observers']
        }
}

export default connect(mapStateToProps)(MeasurementRows)
