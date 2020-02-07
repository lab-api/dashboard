import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import { get, post } from '../utilities.js'

function Submitter(props) {
  React.useEffect(() => {props.dispatch(actions.optimization.put('parameters', props.checked))})  // keep optimization parameters linked to checked
  var complete = true

  var parameters_complete = false
  var bounds_complete = true
  for (var instrument in props.checked){
    if (props.checked[instrument].length > 0) {
      parameters_complete = true
    }

    for (var i in props.checked[instrument]) {
      var parameter = props.checked[instrument][i]
      const enteredMin = parseFloat(props.optimization.bounds[instrument][parameter]['min'])
      const enteredMax = parseFloat(props.optimization.bounds[instrument][parameter]['max'])
      const min = parseFloat(props.bounds[instrument][parameter]['min'])
      const max = parseFloat(props.bounds[instrument][parameter]['max'])
      bounds_complete &= (enteredMin >= min && enteredMin <= max && isFinite(enteredMin))
      bounds_complete &= (enteredMax >= min && enteredMax <= max && isFinite(enteredMax))
      bounds_complete &= (enteredMin < enteredMax)
    }
  }
  complete &= parameters_complete
  complete &= bounds_complete
  complete &= (props.optimization.algorithm != "")
  complete &= (props.optimization.objective != "")
  complete &= (props.optimization.instrument != "")
  function submit() {
      console.log(props.optimization)
      post('/optimistic/submit', props.optimization, (data)=>{displayResult(data, props.optimization.algorithm)})
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
          bounds: state['bounds']}
}
export default connect(mapStateToProps)(Submitter)
