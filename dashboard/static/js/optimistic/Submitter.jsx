import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import { get, post } from '../utilities.js'
import produce from 'immer'

function Submitter(props) {
  React.useEffect(() => {props.dispatch(actions.ui.optimization.put('parameters', props.checked))})  // keep optimization parameters linked to checked
  var complete = true
  const bounds = {}
  var parameters_complete = (props.checked.length > 0)

  for (var i in props.checked) {
    const id = props.checked[i]
    const min = props.ui['bounds-min'][id]['buffer']
    const max = props.ui['bounds-max'][id]['buffer']
    bounds[id] = {'min': min, 'max': max}
  }

  function checkError(feature) {
    let error = false
    for (var i in props.checked) {
      const id = props.checked[i]
      error = error || props.ui[feature][id]['error']
    }
    return error
  }

  complete &= !checkError('bounds-min')
  complete &= !checkError('bounds-max')
  complete &= parameters_complete
  complete &= (props.optimization.algorithm != "")
  complete &= (props.optimization.objective != "")

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
          ui: state['ui'],
          optimization: state['ui']['optimization']}
}
export default connect(mapStateToProps)(Submitter)
