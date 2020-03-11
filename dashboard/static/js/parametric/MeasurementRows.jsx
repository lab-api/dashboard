import React from 'react';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import { get, post } from '../utilities.js'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import Popover from '@material-ui/core/Popover';
import PlaceholderTextField from '../components/PlaceholderTextField.jsx'
import Switch from '@material-ui/core/Switch';

function MeasurementRows(props) {
  const [buttonsVisible, setButtonsVisible] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const alertPopoverOpen = Boolean(anchorEl)
  const handleClick = event => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }


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
    if (props.observers.includes(id)) {
      unwatch(id)
    }
    else {
      watch(id)
    }
  }

  function watch(id) {
    post('/monitor/watch', {'id': id})
    props.dispatch(actions.observers.add(id))
  }

  function unwatch(id) {
    post('/monitor/unwatch', {'id': id})
    props.dispatch(actions.observers.remove(id))

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

  function updateMin(id, text, callback) {
    post('/measurements/'+id+'/min', {'value': text}, (response) => {
      props.dispatch(actions.measurements.updateMin(id, response))
      callback()
    })
  }

  function updateMax(id, text, callback) {
    post('/measurements/'+id+'/max', {'value': text}, (response) => {
      props.dispatch(actions.measurements.updateMax(id, response))
      callback()
    })
  }

  return (
    <React.Fragment>
      {ids.map((id, i) => (
      <React.Fragment key={'fragment'+id}>
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
          <div className='row'>
          <IconButton onClick={handleClick}>
            {props.observers.includes(id)? <NotificationsActiveIcon />: <NotificationsNoneIcon/>}
          </IconButton>
          {buttonsVisible == id? (
            <IconButton aria-label="refresh"  onClick={(event)=>measureResult(event, id)}>
              <PlayArrowIcon />
            </IconButton>
          ): null
          }
          </div>

        </TableCell>
        <TableCell/>
      </TableRow>


      <Popover
        open={alertPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Switch
          checked={props.observers.includes(id)}
          onChange={(event) => toggle_watch(event, id)}
        />
        <PlaceholderTextField value={props.measurements[id]['min']}
                              label="Min"
                              onChange={(text, callback) => updateMin(id, text, callback)}
        />
        <PlaceholderTextField value={props.measurements[id]['max']}
                              label="Max"
                              onChange={(text, callback) => updateMax(id, text, callback)}
        />
      </Popover>
      </React.Fragment>

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
