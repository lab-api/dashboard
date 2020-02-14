import produce from 'immer'

// reducer
export default function reducer(state=[], action) {
  switch(action.type) {
    default : return state;

    case 'check':
      let newState = state.concat(action.ids)
      newState = [...new Set(newState)]
      return newState

    case 'uncheck':
      return state.filter(value => !action.ids.includes(value))

    case 'toggle':
      const checked = (state || []).includes(action.id)
      if (checked) {
        return reducer(state=state, action={'type': 'uncheck', 'ids': [action.id]})
      }
      else {
        return reducer(state=state, action={'type': 'check', 'ids': [action.id]})
      }
  }
}

// actions
export function check(ids) {
  return {type: 'check', ids: ids}
}

export function uncheck(ids) {
  return {type: 'uncheck', ids: ids}
}

export function toggle(id) {
  return {type: 'toggle', id: id}
}
