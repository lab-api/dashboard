import React from 'react';
import { connect } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import get from '../utilities.js'
import * as actions from '../reducers/actions.js'

function OptimizerSelector(props) {
  const options = props.algorithmChoices
  const setOptions = props.setAlgorithmChoices

  function callback(list) {
    list = JSON.parse(list)
    setOptions(list)
    // props.setAlgorithm(list[0])
    props.dispatch(actions.updateOptimizer('algorithm', list[0]))
    updateOptions(list[0])
  }

  function dispatchSettings(options) {
    options = JSON.parse(options)
    props.dispatch(actions.updateOptimizerSettings(options))  // dispatch default settings on algorithm change
  }

  function updateOptions(algorithm) {
    get('/optimistic/algorithms/'.concat(algorithm, '/parameters'),
        (options)=>dispatchSettings(options))
  }

  React.useEffect(() => {
    if (props.algorithm == "") {
    get('/optimistic/algorithms', callback)
  } }, [])

  function handleChange(event) {
    // props.setAlgorithm(event.target.value)
    props.dispatch(actions.updateOptimizer('algorithm', event.target.value))
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

function mapStateToProps(state){
  return {algorithm: state['optimization']['algorithm']}
}
export default connect(mapStateToProps)(OptimizerSelector)
