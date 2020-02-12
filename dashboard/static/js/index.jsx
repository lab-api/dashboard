import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App.jsx"
import reducer from './reducers/reducer.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import io from 'socket.io-client';

function prepareValidationState(state, keys) {
  /// prepare initial state for ui
  keys.forEach(key => {
    state['ui'][key] = {}
    for (var instrument in state['parameters']) {
      state['ui'][key][instrument] = {}
      for (var parameter in state['parameters'][instrument]) {
        state['ui'][key][instrument][parameter] = {'display': '',
                                                   'buffer': '',
                                                   'error': false,
                                                   'errorText': ' '}
      }
    }
  })
  return state
}

function prepareUIState(state) {
  state['ui'] = {}
  state['alert'] = {'open': false, 'severity': 'error', 'text': ''}
  state['checked'] = {}
  state['ui']['optimization'] = {'algorithm': '',
                                 'settings': {},
                                 'instrument': '',
                                 'objective': '',
                                 'parameters': {}}
  for (var instrument in state['parameters']) {
    state['checked'][instrument] = []
    state['ui']['optimization']['parameters'][instrument] = []
  }
  return state
}

export function createGUI(state) {
  state = prepareUIState(state)
  state = prepareValidationState(state, ['parameters', 'bounds-min', 'bounds-max'])  // prepare user input validation state
  const store = createStore(reducer, state)
  const socket = io('http://localhost:8000');
  ReactDOM.render(<Provider store={store}><App socket={socket} dispatch={store.dispatch}/></Provider>, document.getElementById("root"))
}
