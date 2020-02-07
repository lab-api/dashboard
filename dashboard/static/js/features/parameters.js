import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'parameters/patch':
      return produce(state, draft => {
        draft[action.instrument][action.parameter] = action.value
      })
    }
}

export function patch(instrument, parameter, value) {
  return {type: 'parameters/patch', instrument: instrument, parameter: parameter, value: value}
}
