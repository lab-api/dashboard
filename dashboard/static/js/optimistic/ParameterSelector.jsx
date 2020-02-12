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

  for (var instrument in props.checked) {
      for (var i in props.checked[instrument]) {
        const name = props.checked[instrument][i]
        rows.push({name: name, instrument: instrument})
      }
  }

  function handleChange(instrument, name, index, value, error) {
    props.dispatch(actions.optimization.bounds.patch(instrument, name, index, value))
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
            <TableRow key={row.instrument+'-'+row.name}>
              <TableCell align="right">{row.instrument}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">
                <ValidatedInput defaultValue={props.parameter_bounds[row.instrument][row.name]['min']}
                             id={'bounds-min'}
                             instrument={row.instrument}
                             parameter={row.name}
                             min={props.parameter_bounds[row.instrument][row.name]['min']}
                             max={props.parameter_bounds[row.instrument][row.name]['max']}
                />
              </TableCell>
              <TableCell align="right">
              <ValidatedInput defaultValue={props.parameter_bounds[row.instrument][row.name]['max']}
                           id={'bounds-max'}
                           instrument={row.instrument}
                           parameter={row.name}
                           min={props.parameter_bounds[row.instrument][row.name]['min']}
                           max={props.parameter_bounds[row.instrument][row.name]['max']}
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
          bounds: state['optimization']['bounds'],
          parameter_bounds: state['bounds']}
}
export default connect(mapStateToProps)(ParameterSelector)
