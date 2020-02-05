import { setIn, mergeDeep } from 'immutable'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'addCheckboxes':
      return setIn(state, [[action.instrument]], [])

    case 'check':
      return mergeDeep(state, {[action.instrument]: action.parameters})

    case 'uncheck':
      const newParameters = state[action.instrument].filter(value => !action.parameters.includes(value))
      return setIn(state, [action.instrument], newParameters)
      // return state.filter(value => !action.parameters.includes(value))

    case 'toggle':
      const checked = (state[action.instrument] || []).includes(action.parameter)

      if (checked) {
        return reducer(state=state, action={'type': 'uncheck', 'instrument': action.instrument, 'parameters': [action.parameter]})
      }
      else {
        return reducer(state=state, action={'type': 'check', 'instrument': action.instrument, 'parameters': [action.parameter]})
      }
  }
}
