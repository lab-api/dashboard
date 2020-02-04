import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux'

function ParameterSelector(props) {
  const rows = []

  for (var instrument in props.state) {
      for (var i in props.state[instrument]['checked']) {
        const name = props.state[instrument]['checked'][i]
        rows.push({name: name, instrument: instrument})
      }
  }


  function handleChange(instrument, name, index) {
    const value = parseFloat(event.target.value)
    props.setBounds({...props.bounds, [instrument]: {...props.bounds[instrument], [name]: {...props.bounds[instrument][name], [index]: value}} })
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Instrument</TableCell>
            <TableCell align="right">Parameter</TableCell>
            <TableCell align="right">Min.</TableCell>
            <TableCell align="right">Max.</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell align="right">{row.instrument}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right"><Input onChange={(event)=>handleChange(row.instrument, row.name, 'min', event)} placeholder={props.bounds[row.instrument][row.name]['min'].toString()}/></TableCell>
              <TableCell align="right"><Input onChange={(event)=>handleChange(row.instrument, row.name, 'max', event)} placeholder={props.bounds[row.instrument][row.name]['max'].toString()}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function mapStateToProps(state){
  // pass entire store state
  return { state }
}
export default connect(mapStateToProps)(ParameterSelector)