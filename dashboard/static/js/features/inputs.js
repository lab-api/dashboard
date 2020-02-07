import produce from 'immer'

// reducer
export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'inputs/patch':
      return produce(state, draft => {
        draft[action.instrument][action.parameter] = action.value
      })
    }
}

// actions
export function patch(instrument, parameter, value) {
  return {type: 'inputs/patch', instrument: instrument, parameter: parameter, value: value}
}
