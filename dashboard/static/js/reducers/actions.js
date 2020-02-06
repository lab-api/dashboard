export function updateOptimizer(field, value) {
  return {type: 'updateOptimizer', field: field, value: value}
}

export function updateOptimizerSettings(dict) {
  return {type: 'updateOptimizerSettings', dict: dict}
}

export function patchOptimizerSettings(name, value) {
  return {type: 'patchOptimizerSettings', name: name, value: value}
}

export function patchOptimizer(field, name, value) {
  return {type: 'patchOptimizer', field: field, name: name, value: value}
}

export function patchBounds(instrument, name, index, value) {
  return {type: 'patchBounds', index: index, instrument: instrument, name: name, value: value}
}

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

export function addCheckboxes(instrument) {
  return {type: 'addCheckboxes', instrument: instrument}
}

export function check(instrument, parameters) {
  return {type: 'check', instrument: instrument, parameters: parameters}
}

export function uncheck(instrument, parameters) {
  return {type: 'uncheck', instrument: instrument, parameters: parameters}
}

export function toggle(instrument, parameter) {
  return {type: 'toggle', instrument: instrument, parameter: parameter}
}
