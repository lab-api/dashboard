import React from 'react';
import { connect } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import get from '../utilities.js'

function OptimizerSelector(props) {
  const [options, setOptions] = React.useState([])

  function callback(list) {
    list = JSON.parse(list)
    setOptions(list)
    props.setAlgorithm(list[0])
    updateOptions(list[0])
  }

  function updateOptions(algorithm) {
    get('/optimistic/algorithms/'.concat(algorithm, '/parameters'), (options)=>props.update(JSON.parse(options)))
  }

  React.useEffect(() => {
    get('/optimistic/algorithms', callback)
  }, [] )
  function handleChange(event) {
    props.setAlgorithm(event.target.value)
    updateOptions(event.target.value)
  }

  return (
    <Grid container justify='center'>
      <Select value={props.algorithm} autoWidth={true} variant="outlined" onChange={handleChange}>
      {options.map((row, index) => {
        return (
        <MenuItem key={row} value={row}>{row}</MenuItem>
      )
      })}
      </Select>
    </Grid>
  );
}

export default OptimizerSelector
