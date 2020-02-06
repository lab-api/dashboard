import { setIn } from 'immutable'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'updateInput':
      return setIn(state, [[action.instrument], [action.parameter]], action.value)
    }
}
