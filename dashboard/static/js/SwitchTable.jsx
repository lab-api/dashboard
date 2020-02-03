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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import get from './utilities.js'
import Input from '@material-ui/core/Input';


function SwitchRow(props){
  const id = props.inst_name.concat('-', props.name, '-value')

  return (
      <TableRow key={props.name}>
        <TableCell component="th" scope="row">
          {props.name}
        </TableCell>
        <TableCell align="right">
        <Switch
          id = {id}
          checked={props.checked}        // use state and handler from parent
          onChange={props.handleChange}
          name={props.name}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        </TableCell>
      </TableRow>
    )
  }

export default function SwitchTable(props){
  const prefix = '/instruments/'.concat(props.instrument, '/switches/')
  const initialState = {}
  for (var i in props.switches){
    initialState[props.switches[i].name] = props.switches[i].value
  }
  const [state, setState] = useState(initialState)

  function handleChange(event) {
    const name = event.target.name
    setState({...state, [name]: event.target.checked})
    const url = prefix.concat(name, '/set/', event.target.checked)
    get(url)
  }

  function refresh() {
    for (var i in props.switches) {
      const name = props.switches[i].name
      const url = prefix.concat(name, '/get')

      function callback(val) {
        setState({...state, [name]: val=='True'})
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
          {props.switches.map(row => (<SwitchRow name={row.name} inst_name={props.instrument} checked={state[row.name]} key={row.name} handleChange={handleChange} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
