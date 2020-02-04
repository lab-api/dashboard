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

export default function JSONTable(props) {
  const options = props.options
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
              <TableCell align="right"><Input placeholder={options[row].toString()}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
