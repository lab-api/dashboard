export function put(field, value) {
  return {type: 'putOptimizer', field: field, value: value}
}

export function patch(field, name, value) {
  return {type: 'patchOptimizer', field: field, name: name, value: value}
}


export function patchBounds(instrument, name, index, value) {
  return {type: 'patchBounds', index: index, instrument: instrument, name: name, value: value}
}

export const bounds = {patch: patchBounds, put: (value)=>put('bounds', value)}
