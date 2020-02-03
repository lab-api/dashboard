export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;
    case 'check': return {
      ...state, [action.instrument]: {...state[action.instrument], 'checked' : [...state[action.instrument]['checked'].filter(value => !action.parameter.includes(value)), ...action.parameter]
    }}
    case 'uncheck':
      return {
        ...state, [action.instrument]: {...state[action.instrument], 'checked' : state[action.instrument]['checked'].filter(value => !action.parameter.includes(value))
      }}
    case 'toggle':
      const checked = state[action.instrument]['checked'].includes(action.parameter)
      if (checked) {
        return reducer(state=state, action={'type': 'uncheck', 'instrument': action.instrument, 'parameter': [action.parameter]})
      }
      else {
        return reducer(state=state, action={'type': 'check', 'instrument': action.instrument, 'parameter': [action.parameter]})
      }

    case 'update': return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters' : {...state[action.instrument]['parameters'], [action.parameter]: action.value}
    }}

    case 'addInstrument': return {
      ...state, [action.instrument]: {'parameters': {}, 'switches': {}, 'checked': []}
    }
    case 'addParameter':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters': {...state[action.instrument]['parameters'], [action.parameter]: action.value}}
    }
    case 'addSwitch':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'switches': {...state[action.instrument]['switches'], [action.parameter]: action.value}}
    }
  }
}
