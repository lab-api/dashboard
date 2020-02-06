export function put(instrument) {
  return {type: 'addCheckboxes', instrument: instrument}
}

export function patch(instrument, parameters, value) {
  if (value == true) {
    return check(instrument, parameters)
  }
  return uncheck(instrument, parameters)
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
