import checked from '../features/checked.js'
import switches from '../features/switches.js'
import instruments from '../features/instruments.js'
import measurements from '../features/measurements.js'
import alert from '../features/alert.js'
import knobs from '../features/knobs.js'
import selectors from '../features/selectors.js'
import ui from '../features/ui.js'
import observers from '../features/observers.js'

import { combineReducers } from 'redux'

const reducer = combineReducers({ui, alert, checked, switches, selectors, observers, instruments, measurements, knobs})

export default reducer
