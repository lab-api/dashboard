import { setIn } from 'immutable'

export default function reducer(state={algorithm: "", settings: {}, objective: "", instrument: "", parameters: {}, bounds: {}}, action) {
  switch(action.type) {
    default : return state;

    case 'updateOptimizer':
      return setIn(state, [[action.field]], action.value)

    case 'updateOptimizerSettings':
      return setIn(state, ['settings'], action.dict)

    case 'patchOptimizerSettings':
      return setIn(state, ['settings', [action.name]], action.value)

    case 'patchOptimizer':
      return setIn(state, [[action.field], [action.name]], action.value)

      case 'patchBounds':
        return setIn(state, ['bounds', [action.instrument], [action.name], action.index], action.value)
    }
}
