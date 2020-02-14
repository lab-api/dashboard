import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'knobs/update':
      return produce(state, draft => {
        draft[action.id].value = action.value
      })
    }
}

export function update(id, value) {
  return {type: 'knobs/update', id: id, value: value}
}
