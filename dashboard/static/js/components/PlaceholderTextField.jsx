import React from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from "@material-ui/icons/Cached";
import SendIcon from "@material-ui/icons/Send";

export default function PlaceholderTextField(props) {
  const [text, setText] = React.useState('')

  function onChange(event) {
    setText(event.target.value)
  }

  function onSubmit(event) {
    // Call props.onChange and pass a callback to set the value field to 0 after
    // the placeholder updates
    props.onChange(text, () => setText(''))
  }

  return (
    <Box mt={1} ml={2} alignItems="center">
      <TextField placeholder={props.value.toString()}
                 value={text}
                 onChange={onChange}
                 variant = "outlined"
                 size = "small"
                 label={props.label}
                 InputLabelProps={{ shrink: true }}
      />
      <IconButton onClick={onSubmit}>
        <SendIcon/>
      </IconButton>
    </Box>
  )
}
