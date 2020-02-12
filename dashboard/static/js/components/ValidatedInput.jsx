import React from 'react'
import TextField from '@material-ui/core/TextField';
import * as actions from '../reducers/actions.js'
import { connect } from 'react-redux'

function StoredInput({defaultValue, id, ui, dispatch, min, max, instrument, parameter}) {

  function patch(field, value) {
    dispatch(actions.ui.patch(id, field, instrument, parameter, value))
  }

  function update(newValue) {
    // fully works
    let stringValue = newValue.toString()
    if (stringValue.length == 0) {
      stringValue = defaultValue
    }

    patch('display', newValue)
    patch('buffer', parseFloat(stringValue))
    validate(parseFloat(stringValue))
  }

  function validate(newValue) {
    let newError = true
    let newErrorText = ' '
    if (newValue < min) { newErrorText = 'Too low.' }
    else if (newValue > max) { newErrorText = 'Too high.' }
    else if (!isFinite(newValue)) { newErrorText = 'Invalid value.' }
    else {
      newError = false
      newErrorText = ' '
    }

    patch('error', newError)
    patch('errorText', newErrorText)
  }

  update(ui['display'])

  return (
    <div>
      {(ui != null)?   // defer rendering until state is prepared
      <TextField onChange={(event) => update(event.target.value)}
                 value={ui['display']}
                 placeholder={defaultValue.toString()}
                 error={ui['error']}
                 helperText={ui['errorText']}
                 />: null
               }
    </div>
  )
}

function mapStateToProps(state, ownProps){
  return {ui: state['ui'][ownProps.id][ownProps.instrument][ownProps.parameter]}
}

export default connect(mapStateToProps)(StoredInput)
