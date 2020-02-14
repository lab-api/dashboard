import checked from '../features/checked.js'
import switches from '../features/switches.js'
import instruments from '../features/instruments.js'
import measurements from '../features/measurements.js'
import alert from '../features/alert.js'
import knobs from '../features/knobs.js'
import ui from '../features/ui.js'

import { combineReducers } from 'redux'

const reducer = combineReducers({ui, alert, checked, switches, instruments, measurements, knobs})

export default reducer
