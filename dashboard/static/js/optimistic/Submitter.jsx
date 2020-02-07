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
  for (var instrument in props.checked){
    if (props.checked[instrument].length > 0) {
      parameters_complete = true
    }
  }
  complete &= parameters_complete

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
  return {checked: state['checked'], optimization: state['optimization']}
}
export default connect(mapStateToProps)(Submitter)
