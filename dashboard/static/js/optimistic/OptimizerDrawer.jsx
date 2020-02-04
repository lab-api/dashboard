import React from 'react'
import OptimizerSelector from './OptimizerSelector.jsx'
import ParameterSelector from "./ParameterSelector.jsx"
import MeasurementSelector from "./MeasurementSelector.jsx"
import Submitter from "./Submitter.jsx"
import JSONTable from './JSONTable.jsx'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function OptimizerDrawer() {
  const [optimizerOptions, setOptimizerOptions] = React.useState({})
  const [algorithm, setAlgorithm] = React.useState('')
  const [measurement, setMeasurement] = React.useState('')
  const [instrument, setInstrument] = React.useState('')
  return (
    <div>
      <Typography align='center' variant="h4">
        Measurements
      </Typography>
      <Divider/>
      <Typography align='center'> <b>1. Select dependent variable</b> </Typography>
      <MeasurementSelector measurement={measurement} setMeasurement={setMeasurement} instrument={instrument} setInstrument={setInstrument}/>

      <Divider/>
      <Typography align='center'> <b>2. Select independent variables</b> </Typography>
      <ParameterSelector/>

      <Divider/>
      <Typography align='center'> <b>3. Select optimizer</b> </Typography>
      <OptimizerSelector algorithm={algorithm} setAlgorithm={setAlgorithm} update={setOptimizerOptions}/>
      <JSONTable options={optimizerOptions}/>

      <Divider/>
      <Submitter measurement={measurement} algorithm={algorithm} options={optimizerOptions} instrument={instrument}/>
    </div>
  )
}
