import produce from 'immer'
import {setIn} from 'immutable'
export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'ui/patch':
      return setIn(state, [[action.key], [action.id], [action.field]], action.value)

    case 'optimizer/put':
      return produce(state, draft => {
        draft['optimization'][action.field] = action.value
      })

    case 'optimizer/bounds/patch':
      return produce(state, draft => {
        draft['optimization']['bounds'][action.id][action.index] = action.value
      })
    }
}


export function patch(key, id, field, value) {
  return {type: 'ui/patch', key: key, id: id, field: field, value: value}
}

export function clear(key, id, field) {
  // reset the display field
  return {'type': 'ui/patch', id: id, key: key, field: 'display', value: ''}
}

function putOptimizer(field, value) {
  return {type: 'optimizer/put', field: field, value: value}
}

function patchBounds(instrument, id, index, value) {
  return {type: 'optimizer/bounds/patch', id: id, index: index, value: value}
}

export const optimization = {put: putOptimizer, bounds: {patch: patchBounds}}
