// A table which updates itself according to a passed dictionary
import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import * as actions from '../reducers/actions.js'
import { connect } from 'react-redux'

function JSONTable(props) {
  const options = props.settings

  function handleChange(name, value) {
    props.dispatch(actions.optimization.patch('settings', name, parseFloat(value)))

  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Option</TableCell>
            <TableCell align="right">Value</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(options).map(row => (
            <TableRow key={row}>
              <TableCell align="left">{row}</TableCell>
              <TableCell align="right"><Input onChange={(event)=>handleChange(row, event.target.value)}
                                              placeholder={options[row].toString()}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function mapStateToProps(state){
  return {settings: state['optimization']['settings']}
}
export default connect(mapStateToProps)(JSONTable)
