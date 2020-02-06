import React from 'react';
import ReactDOM from 'react-dom';
import store from './store.jsx'
import { Provider, connect } from 'react-redux'
import App from "./App.jsx"
import * as actions from "./reducers/actions.js"

function prepareInitialState(parameters) {
  for (var instrument in parameters) {
    store.dispatch(actions.addInstrument(instrument))
    store.dispatch(actions.checked.put(instrument))

    const instrument_params = parameters[instrument]
    for (var kind in instrument_params) {
      for (var name in instrument_params[kind]){
        const value = instrument_params[kind][name]['value']
        if (kind=='switch'){
          store.dispatch(actions.updateSwitch(instrument, name, value))
        }
        else if (kind=='knob'){
          store.dispatch(actions.updateParameter(instrument, name, value))
          store.dispatch(actions.updateInput(instrument, name, ''))

          const bounds = {'min': instrument_params[kind][name]['min'], 'max': instrument_params[kind][name]['max']}
          store.dispatch(actions.updateBounds(instrument, name, bounds))
        }
        else if (kind=='measurement'){
          store.dispatch(actions.addMeasurement(instrument, name))
        }
      }
    }
  }
}

export function createGUI(parameters) {
  prepareInitialState(parameters)
  ReactDOM.render(<Provider store={store}><App parameters={parameters}/></Provider>, document.getElementById("root"))
}
