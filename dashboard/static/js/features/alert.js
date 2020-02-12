import produce from 'immer'

export default function reducer(state={}, action) {
  switch(action.type) {
    default : return state;
    case 'show':
      return {'open': true, 'severity': action.severity, 'text': action.text}
    case 'hide':
      return produce(state, draft => {
        draft['open'] = false
      })
    }
}

export function show(text, severity='error') {
    return {type: 'show', text: text, severity: severity}
}

export function hide() {
    return {type: 'hide'}
}
