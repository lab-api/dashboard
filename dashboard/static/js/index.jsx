import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App.jsx"
import reducer from './reducers/reducer.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

export function createGUI(state) {
  const store = createStore(reducer, state)
  ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"))
}
