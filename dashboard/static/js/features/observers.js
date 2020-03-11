import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'observers/add':
      return state.concat(action.id)

    case 'observers/remove':
      return state.filter(value => action.id != value)
    }
}

export function add(id) {
  return {type: 'observers/add', id: id}
}

export function remove(id) {
  return {type: 'observers/remove', id: id}
}
