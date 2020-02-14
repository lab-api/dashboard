import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App.jsx"
import reducer from './reducers/reducer.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import io from 'socket.io-client';

function prepareValidationState(state, keys) {
  keys.forEach(key => {
    state['ui'][key] = {}
    for (var id in state['knobs']) {
      state['ui'][key][id] = {'display': '', 'buffer': '', 'error': false, 'errorText': ' '}
    }
  })
  return state
}

function prepareUIState(state) {
  state['alert'] = {'open': false, 'severity': 'error', 'text': ''}
  state['checked'] = []
  state['ui'] = {}
  state['ui']['optimization'] = {'algorithm': '',
                                 'settings': {},
                                 'objective': '',
                                 'parameters': {}}
  for (var instrument in state['parameters']) {
    state['ui']['optimization']['parameters'][instrument] = []
  }
  return state
}

export function createGUI(state) {
  state = prepareUIState(state)
  state = prepareValidationState(state, ['knobs', 'bounds-min', 'bounds-max'])  // prepare user input validation state
  console.log(state)
  const store = createStore(reducer, state)
  const socket = io('http://localhost:8000');
  ReactDOM.render(<Provider store={store}><App socket={socket} dispatch={store.dispatch}/></Provider>, document.getElementById("root"))
}
