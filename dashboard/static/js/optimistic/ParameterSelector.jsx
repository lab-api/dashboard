import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import ValidatedInput from '../components/ValidatedInput.jsx'
import produce from 'immer'

function ParameterSelector(props) {
  const rows = []

  for (var i in props.checked) {
    const id = props.checked[i]
    const name = props.knobs[id].name
    const instrument = props.knobs[id].instrument
    const instrument_name = props.instruments[instrument].name
    rows.push({name: name, instrument: instrument_name, id: id})

  }

  function defaultValue(id) {
    return props.knobs[id]
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
            <TableRow key={row.id}>
              <TableCell align="right">{row.instrument}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">
              <ValidatedInput defaultValue={props.knobs[row.id].min}
                           feature={'bounds-min'}
                           instrument={row.instrument}
                           parameter={row.name}
                           min={props.knobs[row.id].min}
                           max={props.knobs[row.id].max}
                           knobID={row.id}
              />
              </TableCell>
              <TableCell align="right">
              <ValidatedInput defaultValue={props.knobs[row.id].max}
                           feature={'bounds-max'}
                           instrument={row.instrument}
                           parameter={row.name}
                           min={props.knobs[row.id].min}
                           max={props.knobs[row.id].max}
                           knobID={row.id}
              />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function mapStateToProps(state){
  return {checked: state['checked'],
          knobs: state['knobs'],
          instruments: state['instruments']}
}
export default connect(mapStateToProps)(ParameterSelector)
