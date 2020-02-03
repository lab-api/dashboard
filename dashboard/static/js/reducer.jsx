export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;
    case 'check': return {
      ...state, [action.instrument]: {...state[action.instrument], 'checkboxes' : {...state[action.instrument]['checkboxes'], [action.parameter]: true}
    }}
    case 'uncheck': return {
      ...state, [action.instrument]: {...state[action.instrument], 'checkboxes' : {...state[action.instrument]['checkboxes'], [action.parameter]: false}
    }}
    case 'toggle': return {
      ...state, [action.instrument]: {...state[action.instrument], 'checkboxes' : {...state[action.instrument]['checkboxes'], [action.parameter]: !state[action.instrument]['checkboxes'][action.parameter]}
    }
    }

    case 'update': return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters' : {...state[action.instrument]['parameters'], [action.parameter]: action.value}
    }}

    case 'addInstrument': return {
      ...state, [action.instrument]: {'parameters': {}, 'switches': {}, 'checkboxes': {}}
    }
    case 'addParameter':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'parameters': {...state[action.instrument]['parameters'], [action.parameter]: action.value}}
    }
    case 'addSwitch':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'switches': {...state[action.instrument]['switches'], [action.parameter]: action.value}}
    }
    case 'addCheckbox':
    return {
      ...state, [action.instrument]: {...state[action.instrument], 'checkboxes': {...state[action.instrument]['checkboxes'], [action.parameter]: action.value}}
    }
  }
}
