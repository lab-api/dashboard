// A general-purpose selector which populates its choices from a function passed
// through the props which is called after the DOM renders.

// The "source" prop is a function which takes a callback as an argument, retrieves
// a list, and passes it into the callback.
// The "callback" prop is executed when the selection changes.

import React from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types';
import { isEqual } from 'lodash'

export default function Selector({source, callback, label}) {
  const [choices, setChoices] = React.useState([])
  const [currentChoice, setCurrentChoice] = React.useState('')

  function updateChoices(newChoices) {
      if (!isEqual(choices, newChoices)) {
        setChoices(newChoices)
        setCurrentChoice(newChoices[newChoices.length-1])
        handleChange(newChoices[newChoices.length-1])     // added
      }
  }

  function handleChange(choice) {
    setCurrentChoice(choice)
    if (typeof(callback) != 'undefined') {
      callback(choice)
    }
  }
  React.useEffect(() => source(updateChoices))    // populate choices when the element is rendered
  return (
    <FormControl>
      <Select value={currentChoice}
              autoWidth={true}
              variant="outlined"
              onChange={(event) => handleChange(event.target.value)}
              >
        {choices.map((row, index) => {
            return (
              <MenuItem key={row} value={row}>{row}</MenuItem>
              )
            }
          )
        }
      </Select>
      <FormHelperText>{label}</FormHelperText>
    </FormControl>
  )
}

Selector.propTypes = {
  source: PropTypes.func,
  callback: PropTypes.func,
  label: PropTypes.string
}
