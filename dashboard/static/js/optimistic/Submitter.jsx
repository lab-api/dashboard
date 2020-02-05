import React from 'react'
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

function Submitter(props) {

  function submit() {
    const checked = props.checked


    const bounds = {}
    for (var instrument in checked){
      bounds[instrument] = {}
      for (var i in checked[instrument]) {
        const name = checked[instrument][i]
        bounds[instrument][name] = props.bounds[instrument][name]
      }
    }
    const dict = {}
    dict['algorithm'] = props.algorithm
    dict['settings'] = props.options
    dict['objective'] = props.measurement
    dict['instrument'] = props.instrument
    dict['parameters'] = checked
    dict['bounds'] = bounds
    console.log(dict)
  }
  return (
    <div>
      <Button onClick={submit} variant="contained">Submit</Button>
    </div>
  )

}

function mapStateToProps(state){
  return {checked: state['checked']}
}
export default connect(mapStateToProps)(Submitter)
