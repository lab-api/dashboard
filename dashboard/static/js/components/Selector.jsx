import React from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Container from '@material-ui/core/Container'
import { get } from '../utilities.js'
import { isEqual } from 'lodash'

export default function Selector(props) {
  const [choices, setChoices] = React.useState([])
  const [currentChoice, setCurrentChoice] = React.useState('')

  const allEqual = arr => arr.every( v => v === arr[0] )

  function getChoices() {
    get(props.url, (newChoices) => {

      if (!isEqual(choices, newChoices)) {
        setChoices(newChoices)
        setCurrentChoice(newChoices[newChoices.length-1])
        handleChange(newChoices[newChoices.length-1])     // added
      }
      }
    )
  }

  function handleChange(choice) {
    setCurrentChoice(choice)
    if (typeof(props.callback) != 'undefined') {
      props.callback(choice)
    }
  }
  React.useEffect(getChoices)    // populate choices when the element is rendered

  return (
    <FormControl>
      <Select value={currentChoice} autoWidth={true} variant="outlined" onChange={(event) => handleChange(event.target.value)}>
      {choices.map((row, index) => {
        return (
        <MenuItem key={row} value={row}>{row}</MenuItem>
      )
      })}
      </Select>
      <FormHelperText>{props.label}</FormHelperText>
    </FormControl>
  )
}
