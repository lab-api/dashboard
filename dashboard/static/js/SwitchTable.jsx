import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import SendIcon from '@material-ui/icons/Send';
import Switch from '@material-ui/core/Switch';
import { get } from './utilities.js'
import Input from '@material-ui/core/Input';
import {connect} from 'react-redux'
import * as actions from './reducers/actions.js'

function SwitchRow(props){

  return (
      <TableRow key={props.name}>
        <TableCell component="th" scope="row">
          {props.name}
        </TableCell>
        <TableCell align="right">
        <Switch
          checked={props.checked}
          onChange={props.handleChange}
          name={props.name}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        </TableCell>
      </TableRow>
    )
  }

function SwitchTable(props){
  const prefix = '/instruments/'.concat(props.instrument, '/switches/')

  function handleChange(event) {
    const name = event.target.name
    props.dispatch(actions.updateSwitch(props.instrument, name, event.target.checked))
    const url = prefix.concat(name, '/set/', event.target.checked)
    get(url)
  }

  function refresh() {
    for (var name in props.switches) {
      const url = prefix.concat(name, '/get')
      function callback(val) {
        props.dispatch(actions.updateSwitch(props.instrument, name, val=='True'))
      }
      get(url, callback)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Switches</TableCell>
            <TableCell align="right">
                <IconButton aria-label="refresh" onClick={refresh}>
                  <CachedIcon />
                </IconButton>
              </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.switches).map(row => (<SwitchRow name={row}
                                                              checked={props.switches[row]}
                                                              key={row}
                                                              handleChange={handleChange} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function mapStateToProps(state, ownProps){
  return {switches: state['switches'][ownProps.instrument] || []}
}
export default connect(mapStateToProps)(SwitchTable)
