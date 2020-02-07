import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default function ResultSnackbar(props){
  function handleSnackbarClose(event) {
    props.setOpen(false)
  }

  function handleSnackbarClick(event) {
    if (event.target.className != 'MuiAlert-message')
    {
      return
    }
    console.log('Snackbar clicked!')
    props.loadDataset()
  }

  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClick={handleSnackbarClick} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity="success">
        Optimization result ready: {props.name}
      </Alert>
    </Snackbar>
  )
}
