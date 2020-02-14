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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function SelectorRows(props) {
  const knobIDs = props.instruments[props.instrumentID].selectors
  const [buttonsVisible, setButtonsVisible] = React.useState('')

  function handleChange(event, id) {
    event.stopPropagation()
    const value = event.target.value
    const url = '/selectors/' + id + '/set/' +  value
    props.dispatch(actions.selectors.update(id, value))

    get(url)
  }

  function refresh(event, id) {
      event.stopPropagation()
      const url = '/selectors/' + id + '/get'
      get(url, (value) => {
        props.dispatch(actions.selectors.update(id, value))
      })
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
        <TableCell>{props.selectors[id].name}</TableCell>
        <TableCell>
          <Select value={props.selectors[id].value}
                  autoWidth={true}
                  variant="outlined"
                  onChange={(event) => handleChange(event, id)}
                  >
            {props.selectors[id].options.map((row, index) => {
                return (
                  <MenuItem key={row} value={row}>{row}</MenuItem>
                  )
                }
              )
            }
          </Select>
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
          selectors: state['selectors'],
          instruments: state['instruments']
        }
}

export default connect(mapStateToProps)(SelectorRows)
