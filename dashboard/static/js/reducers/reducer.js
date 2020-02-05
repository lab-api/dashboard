import parameters from './parameters.js'
import bounds from './bounds.js'
import measurements from './measurements.js'
import checked from './checked.js'
import switches from './switches.js'
import instruments from './instruments.js'
import { combineReducers } from 'redux'

const reducer = combineReducers({bounds, parameters, measurements, checked, switches, instruments})

export default reducer
