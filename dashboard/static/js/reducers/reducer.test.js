import reducer from './reducer.js'
import * as actions from './actions.js'

const addInstrument = actions.addInstrument('circle')
const addedInstrument = reducer({}, addInstrument)['instruments']
test('Adds instrument', () => {
  expect(addedInstrument).toStrictEqual(['circle']);
});

const updateParameter = actions.updateParameter('circle', 'circumference', 3.14)
const updatedParameter = reducer({}, updateParameter)['parameters']
test('Adds parameter', () => {
  expect(updatedParameter).toStrictEqual({'circle': {'circumference': 3.14}});
});

const updateSwitch = actions.updateSwitch('circle', 'visible', true)
const updatedSwitch = reducer({}, updateSwitch)['switches']
test('Adds switch', () => {
  expect(updatedSwitch).toStrictEqual({'circle': {'visible': true}});
});

const updateBounds = actions.updateBounds('circle', 'radius', {'min': 0, 'max': 1})
const updatedBounds = reducer({}, updateBounds)['bounds']
test('Adds bounds', () => {
  expect(updatedBounds).toStrictEqual({'circle': {'radius': {'min': 0, 'max': 1}}});
});

const initMeasurement = actions.initializeMeasurements('circle')
const initiatedMeasurement = reducer({}, initMeasurement)['measurements']
test('Initializes measurements', () => {
  expect(initiatedMeasurement).toStrictEqual({'circle': []});
});

const addCheckboxes = actions.addCheckboxes('circle')
const addedCheckboxes = reducer({}, addCheckboxes)['checked']
test('Adds checkboxes', () => {
  expect(addedCheckboxes).toStrictEqual({'circle': []});
});

const checkParameter = actions.check('circle', ['isRound', 'isNotFlat'])
const checkedParameter = reducer({}, checkParameter)['checked']
test('Checks parameter', () => {
  expect(checkedParameter).toStrictEqual({'circle': ['isRound', 'isNotFlat']});
});

const uncheckParameter = actions.uncheck('circle', ['isRound'])
const uncheckedParameter = reducer({'checked': checkedParameter}, uncheckParameter)['checked']
test('Unchecks parameter', () => {
  expect(uncheckedParameter).toStrictEqual({'circle': ['isNotFlat']});
});
//
const toggleParameter = actions.toggle('circle', 'isNotFlat')
const toggledParameter = reducer({'checked': uncheckedParameter}, toggleParameter)['checked']
test('Toggles parameter', () => {
  expect(toggledParameter).toStrictEqual({'circle': []});
});
