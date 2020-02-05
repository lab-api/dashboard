import { setIn, mergeDeep } from 'immutable'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'addMeasurement':
      return mergeDeep(state, {[action.instrument]: [action.parameter]})
    }
}
