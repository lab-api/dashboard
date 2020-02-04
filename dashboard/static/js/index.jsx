import React from 'react';
import ReactDOM from 'react-dom';
import store from './store.jsx'
import { Provider, connect } from 'react-redux'
import App from "./App.jsx"

function prepareInitialState(parameters) {
  for (var instrument in parameters) {
    store.dispatch({'type': 'addInstrument', 'instrument': instrument})
    const instrument_params = parameters[instrument]
    for (var kind in instrument_params) {
      for (var name in instrument_params[kind]){
        const value = instrument_params[kind][name]
        if (kind=='switch'){
          store.dispatch({'type': 'addSwitch', 'instrument': instrument, 'parameter': name, 'value': value})
        }
        else if (kind=='knob'){
          store.dispatch({'type': 'addParameter', 'instrument': instrument, 'parameter': name, 'value': value})
        }
        else if (kind=='measurement'){
          store.dispatch({'type': 'addMeasurement', 'instrument': instrument, 'parameter': name, 'value': value})
        }
      }
    }
  }
}

export function createGUI(parameters) {
  prepareInitialState(parameters)
  ReactDOM.render(<Provider store={store}><App parameters={parameters}/></Provider>, document.getElementById("root"))
}
