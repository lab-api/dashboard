import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;
    case 'measurements/updateMin':
      return produce(state, draft => {
        draft[action.id].min = action.value
      })
    case 'measurements/updateMax':
      return produce(state, draft => {
        draft[action.id].max = action.value
      })

    }
}


export function updateMin(id, value) {
  return {type: 'measurements/updateMin', id: id, value: value}
}

export function updateMax(id, value) {
  return {type: 'measurements/updateMax', id: id, value: value}
}
