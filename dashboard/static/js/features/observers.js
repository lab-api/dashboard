import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'observers/update':
      const value = parseFloat(action.value).toPrecision(8).toString()
      return produce(state, draft => {
        draft[action.id].value = value
        draft[action.id].data = draft[action.id].data.concat(value).slice(-20)
      })

    case 'observers/add':
      return produce(state, draft => {
        draft[action.id] = action.dict
      })

    case 'observers/remove':
      return produce(state, draft => {
        delete draft[action.id]
      })


    }
}

export function update(id, value) {
  return {type: 'observers/update', id: id, value: value}
}

export function add(id, dict) {
  return {type: 'observers/add', id: id, dict: dict}
}

export function remove(id) {
  return {type: 'observers/remove', id: id}
}
