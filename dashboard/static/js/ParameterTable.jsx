import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import get from './utilities.js'
import Input from '@material-ui/core/Input';
import SendIcon from '@material-ui/icons/Send';

function ParameterRow(name, value, inst_name) {
  value = value.toString()
  var id = inst_name.concat('-', name, '-value')
  var prefix = '/instruments/'.concat(inst_name, '/parameters/')
  function refresh(){
    get(prefix.concat(name, '/get'), update)
  }
  function update(val){
      var element = document.getElementById(id)
      element.value = ''
      element.placeholder = val
    }
  function set() {
        var element = document.getElementById(id)
        var text = element.value
        if (text == '') {
          text = element.placeholder
        }
        var url = prefix.concat(name, '/set/', text)
        element.value = ''
        element.placeholder = text
        get(url)
    }
  return (
    <TableRow key={name}>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">
      <Input placeholder={value} id={id} />
      </TableCell>
      <TableCell align="right">
        <IconButton aria-label="update" onClick={set}>
          <SendIcon />
        </IconButton>
        <IconButton aria-label="refresh" onClick={refresh}>
          <CachedIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function SwitchRow(name, value, inst_name) {
  var id = inst_name.concat('-', name, '-value')
  var prefix = '/instruments/'.concat(inst_name, '/switches/')

  function set() {
        var bool = document.getElementById(id).checked;
        var url = prefix.concat(name, '/set/', bool)
        get(url)
    }
  return (
    <TableRow key={name}>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">
      <FormControlLabel control={<Switch onChange={set} id={id}/>} />

      </TableCell>
    </TableRow>
  );
}

export function ParameterTable(parameters, key) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Parameters</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameters.map(row => (ParameterRow(row.name, row.value, key)))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function SwitchTable(switches, key) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Switches</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {switches.map(row => (SwitchRow(row.name, row.value, key)))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
