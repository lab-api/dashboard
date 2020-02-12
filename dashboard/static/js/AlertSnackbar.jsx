import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux'
import * as actions from './reducers/actions.js'

function AlertSnackbar({dispatch, open, severity, text}){
  function handleClose() {
    dispatch(actions.alert.hide())
  }
  return (
    <Snackbar open={open}
              autoHideDuration={6000}
              onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {text}
      </Alert>
    </Snackbar>
  )
}

function mapStateToProps(state){
  return {open: state['alert']['open'],
          severity: state['alert']['severity'],
          text: state['alert']['text']
        }
}

export default connect(mapStateToProps)(AlertSnackbar)
