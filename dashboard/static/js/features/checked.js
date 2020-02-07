import produce from 'immer'

// reducer
export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'check':
      // return mergeDeep(state, {[action.instrument]: action.parameters})
      return produce(state, draft => {
        draft[action.instrument] = draft[action.instrument].concat(action.parameters)   // concatenate new parameters
        draft[action.instrument] = [...new Set(draft[action.instrument])]               // take unique values only
      })
    case 'uncheck':
      // const newParameters = state[action.instrument].filter(value => !action.parameters.includes(value))
      // return setIn(state, [action.instrument], newParameters)
      return produce(state, draft => {
        draft[action.instrument] = draft[action.instrument].filter(value => !action.parameters.includes(value))
      })

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

// actions
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
