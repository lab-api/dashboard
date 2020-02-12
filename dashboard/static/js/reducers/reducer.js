import parameters from '../features/parameters.js'
import checked from '../features/checked.js'
import switches from '../features/switches.js'
import bounds from '../features/bounds.js'
import instruments from '../features/instruments.js'
import measurements from '../features/measurements.js'
import alert from '../features/alert.js'
import ui from '../features/ui.js'

import { combineReducers } from 'redux'

const reducer = combineReducers({ui, alert, parameters, checked, switches, bounds, instruments, measurements})

export default reducer
