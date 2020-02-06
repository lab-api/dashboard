import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import { setIn } from 'immutable'
import get from '../utilities.js'

function Submitter(props) {
  const checked = props.checked
  var complete = true

  var parameters_complete = false
  for (var instrument in checked){
    if (checked[instrument].length > 0) {
      parameters_complete = true
    }
  }
  complete &= parameters_complete

  complete &= (props.optimization.algorithm != "")
  complete &= (props.optimization.objective != "")
  complete &= (props.optimization.instrument != "")

  function submit() {
    props.dispatch(actions.updateOptimizer('parameters', props.checked))
    console.log(props.optimization)
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
