import React from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

export default function ValidatedInput({onChange, value, min, max}) {
  // An input which displays the error state if text is outside of passed bounds
  // or is not finite
  const [error, setError] = React.useState(false)
  const [errorText, setErrorText] = React.useState(' ')

  React.useEffect(()=>validate(value))

  function validate(value) {
    // Validate the input value to set the error state of the display,
    // then pass an error bool into the onChange callback.
    // const newError = value < min || value > max || !isFinite(value)
    // console.log(value, typeof(value))
    let newError = true
    value = parseFloat(value)

    if (value < min) {
      setErrorText('Too low')
    }
    else if (value > max) {
      setErrorText('Too high')
    }
    else if (!isFinite(value)) {
      setErrorText('Invalid value')
    }
    else {
      newError = false
      setErrorText(' ')
    }
    setError(newError)
    onChange(value, newError)
  }

  return (
    <div style={{transform: 'translateY(10px)'}}>
      <TextField onChange={(event) => validate(event.target.value)}
             placeholder={value.toString()}
             error={error}
             helperText={errorText}
             />
    </div>
  )
}

ValidatedInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
}
