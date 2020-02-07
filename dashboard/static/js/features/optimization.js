import produce from 'immer'

// reducer
export default function reducer(state={algorithm: "", settings: {}, objective: "", instrument: "", parameters: {}, bounds: {}}, action) {
  switch(action.type) {
    default : return state;

    case 'optimizer/put':
      return produce(state, draft => {
        draft[action.field] = action.value
      })
    case 'optimizer/patch':
      return produce(state, draft => {
        draft[action.field][action.name] = action.value
      })

    case 'optimizer/bounds/patch':
      return produce(state, draft => {
        draft['bounds'][action.instrument][action.name][action.index] = action.value
      })
    }
}

// actions
export function put(field, value) {
  return {type: 'optimizer/put', field: field, value: value}
}

export function patch(field, name, value) {
  return {type: 'optimizer/patch', field: field, name: name, value: value}
}


export function patchBounds(instrument, name, index, value) {
  return {type: 'optimizer/bounds/patch', index: index, instrument: instrument, name: name, value: value}
}

export const bounds = {patch: patchBounds, put: (value)=>put('bounds', value)}
