import * as optimization from '../actions/optimization.js'
export {optimization}

import * as checked from '../actions/checked.js'
export {checked}

export function updateParameter(instrument, parameter, value) {
  return {type: 'updateParameter', instrument: instrument, parameter: parameter, value: value}
}

export function updateInput(instrument, parameter, value) {
  return {type: 'updateInput', instrument: instrument, parameter: parameter, value: value}
}

export function updateBounds(instrument, parameter, value) {
  return {type: 'updateBounds', instrument: instrument, parameter: parameter, value: value}
}

export function updateSwitch(instrument, parameter, value) {
  return {type: 'updateSwitch', instrument: instrument, parameter: parameter, value: value}
}

export function initializeMeasurements(instrument) {
  return {type: 'initializeMeasurements', instrument: instrument}
}

export function addMeasurement(instrument, parameter) {
  return {type: 'addMeasurement', instrument: instrument, parameter: parameter}
}

export function addInstrument(instrument) {
  return {type: 'addInstrument', instrument: instrument}
}
