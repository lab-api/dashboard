export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    // checkbox actions
    case 'check': return {
      ...state, [action.instrument]: {...state[action.instrument], 'checked' : [...state[action.instrument]['checked'].filter(value => !action.names.includes(value)), ...action.names]
    }}
    case 'uncheck':
      return {
        ...state, [action.instrument]: {...state[action.instrument], 'checked' : state[action.instrument]['checked'].filter(value => !action.names.includes(value))
      }}
    case 'toggle':
      const checked = state[action.instrument]['checked'].includes(action.name)
      if (checked) {
        return reducer(state=state, action={'type': 'uncheck', 'instrument': action.instrument, 'names': [action.name]})
      }
      else {
        return reducer(state=state, action={'type': 'check', 'instrument': action.instrument, 'names': [action.name]})
      }

    // parameter actions
    case 'update': return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters' : {...state[action.instrument]['parameters'], [action.parameter]: action.value}
    }}

    case 'switch': return {
      ...state, [action.instrument]: {...state[action.instrument], 'switches' : {...state[action.instrument]['switches'], [action.parameter]: action.value}
    }}

    case 'measure': return {
      ...state, [action.instrument]: {...state[action.instrument], 'measurements' : {...state[action.instrument]['measurements'], [action.parameter]: action.value}
    }}

    // initial state prep
    case 'addInstrument': return {
      ...state, [action.instrument]: {'parameters': {}, 'switches': {}, 'checked': [], 'measurements': {}}
    }
    case 'addParameter':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters': {...state[action.instrument]['parameters'], [action.parameter]: action.value}}
    }
    case 'addSwitch':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'switches': {...state[action.instrument]['switches'], [action.parameter]: action.value}}
    }
    case 'addMeasurement':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'measurements': {...state[action.instrument]['measurements'], [action.parameter]: action.value}}
    }
  }
}
