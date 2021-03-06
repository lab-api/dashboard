import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;

    case 'switches/update':
      return produce(state, draft => {
        draft[action.id]['value'] = Boolean(action.value)
      })
    }
}

export function update(id, value) {
  return {type: 'switches/update', id: id, value: value}
}
