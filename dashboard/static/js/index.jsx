import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App.jsx"
import reducer from './reducers/reducer.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

function prepareValidationState(state, keys) {
  /// prepare initial state for ui
  keys.forEach(key => {
    state['ui'][key] = {}
    for (var instrument in state['parameters']) {
      state['ui'][key][instrument] = {}
      for (var parameter in state['parameters'][instrument]) {
        state['ui'][key][instrument][parameter] = {'display': '', 'buffer': '', 'error': false, 'errorText': ' '}
      }
    }
  }
  )
  return state
}


export function createGUI(state) {
  state['ui'] = {}
  state = prepareValidationState(state, ['parameters', 'bounds-min', 'bounds-max'])  // prepare user input validation state
  const store = createStore(reducer, state)
  ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"))
}
