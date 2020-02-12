import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import { get, post } from '../utilities.js'
import produce from 'immer'
import {mergeDeep} from 'immutable'

function checkError(ui, key) {
  // iterate through all UI components for a given key and check whether any
  // are in the error state
  let error = false
  for (var instrument in ui[key]) {
    for (var parameter in ui[key][instrument]) {
      error = error || ui[key][instrument][parameter]['error']
    }
  }
  return error
}

function bufferToDict(ui, key, newKey) {
  const dict = {}
  for (var instrument in ui[key]) {
    dict[instrument] = {}
    for (var parameter in ui[key][instrument]) {
      dict[instrument][parameter] = {[newKey]: ui[key][instrument][parameter]['buffer']}
    }
  }
  return dict
}


function Submitter(props) {
  React.useEffect(() => {props.dispatch(actions.optimization.put('parameters', props.checked))})  // keep optimization parameters linked to checked
  var complete = true
  const bounds = {}
  var parameters_complete = false
  for (var instrument in props.checked){
    bounds[instrument] = {}
    if (props.checked[instrument].length > 0) {
      parameters_complete = true
    }

    for (var i in props.checked[instrument]) {
      var parameter = props.checked[instrument][i]
      const min = props.ui['bounds-min'][instrument][parameter]['buffer']
      const max = props.ui['bounds-max'][instrument][parameter]['buffer']
      bounds[instrument][parameter] = {'min': min, 'max': max}
    }
  }

  const min_bounds = bufferToDict(props.ui, 'bounds-min', 'min')
  const max_bounds = bufferToDict(props.ui, 'bounds-max', 'max')
  const merged = mergeDeep(min_bounds, max_bounds)
  complete &= !checkError(props.ui, 'bounds-min')
  complete &= !checkError(props.ui, 'bounds-max')
  complete &= parameters_complete
  complete &= (props.optimization.algorithm != "")
  complete &= (props.optimization.objective != "")
  complete &= (props.optimization.instrument != "")

  const submission = produce(props.optimization, draft =>{
    draft['bounds'] = bounds
  })
  function submit() {
      post('/optimistic/submit', submission, (data)=>{displayResult(data, props.optimization.algorithm)})
    }


  function displayResult(data, algorithm) {
    props.setSnackbarOpen(true)
    props.setSnackbarName(algorithm)
    console.log(data)
  }

  return (
    <Container>
      <Button onClick={submit}
              color="primary"
              variant="contained"
              disabled={complete? false: true}
              >Submit</Button>
    </Container>
  )
}

function mapStateToProps(state){
  return {checked: state['checked'],
          optimization: state['optimization'],
          bounds: state['bounds'],
          ui: state['ui']}
}
export default connect(mapStateToProps)(Submitter)
