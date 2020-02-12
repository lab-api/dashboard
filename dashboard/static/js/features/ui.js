import produce from 'immer'
import {setIn} from 'immutable'
export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'ui/put':
      return setIn(state, [[action.id], [action.instrument], [action.parameter]], action.values)

    case 'ui/patch':
      return setIn(state, [[action.id], [action.instrument], [action.parameter], [action.field]], action.value)

    case 'optimizer/put':
      return produce(state, draft => {
        draft['optimization'][action.field] = action.value
      })
    case 'optimizer/patch':

      return produce(state, draft => {
        draft['optimization'][action.field][action.name] = action.value
      })

    case 'optimizer/bounds/patch':
      return produce(state, draft => {
        draft['optimization']['bounds'][action.instrument][action.name][action.index] = action.value
      })
    }
}

export function put(id, value) {      // store data for a given instrument/value
  return {type: 'ui/put', id: id, values: values, instrument: instrument, parameter: parameter}
}

export function create(id, instrument, parameter) {
  return {type: 'ui/put', id: id, instrument: instrument, parameter: parameter, values: {'display': '', 'buffer': '', 'error': false, 'errorText': ' '}}
}

export function patch(id, field, instrument, parameter, value) {
  return {type: 'ui/patch', id: id, field: field, instrument: instrument, parameter: parameter, value: value}
}

export function clear(id, instrument, name) {
  // reset the display field
  return {'type': 'ui/patch', id: id, field: 'display', instrument: instrument, parameter: name, value: ''}
}

function putOptimizer(field, value) {
  return {type: 'optimizer/put', field: field, value: value}
}

function patchOptimizer(field, name, value) {
  return {type: 'optimizer/patch', field: field, name: name, value: value}
}


function patchBounds(instrument, name, index, value) {
  return {type: 'optimizer/bounds/patch', index: index, instrument: instrument, name: name, value: value}
}

export const optimization = {put: putOptimizer,
                             patch: patchOptimizer,
bounds: {patch: patchBounds, put: (value)=>put('bounds', value)}}
