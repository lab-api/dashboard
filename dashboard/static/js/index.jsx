import React from 'react';
import ReactDOM from 'react-dom';
import store from './store.jsx'
import { Provider, connect } from 'react-redux'
import App from "./App.jsx"

function prepareInitialState(parameters) {
  for (var instrument in parameters) {
    store.dispatch({'type': 'addInstrument', 'instrument': instrument})
    const instrument_params = parameters[instrument]
    for (var param in instrument_params) {
      const pvalue = instrument_params[param]

      if (typeof(pvalue)=='number') {
        store.dispatch({'type': 'addParameter', 'instrument': instrument, 'parameter': param, 'value': pvalue})
      }
      else {
        store.dispatch({'type': 'addSwitch', 'instrument': instrument, 'parameter': param, 'value': pvalue})
      }
    }
  }
}

export function createGUI(parameters) {
  prepareInitialState(parameters)
  ReactDOM.render(<Provider store={store}><App parameters={parameters}/></Provider>, document.getElementById("root"))
}
