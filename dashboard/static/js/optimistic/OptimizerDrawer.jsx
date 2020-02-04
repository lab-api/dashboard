import React from 'react'
import OptimizerSelector from './OptimizerSelector.jsx'
import ParameterSelector from "./ParameterSelector.jsx"
import MeasurementSelector from "./MeasurementSelector.jsx"
import Submitter from "./Submitter.jsx"
import JSONTable from './JSONTable.jsx'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'

function OptimizerDrawer(props) {
  const [optimizerOptions, setOptimizerOptions] = React.useState({})
  const [algorithm, setAlgorithm] = React.useState('')
  const [measurement, setMeasurement] = React.useState('')
  const [instrument, setInstrument] = React.useState('')

  // use parameter bounds as a first guess for optimizer bounds
  const initialBounds = {}
  for (var inst in props.state){
    initialBounds[inst] = {}
    for (var parameter in props.state[inst]['parameters']){
      initialBounds[inst][parameter] = props.state[inst]['bounds'][parameter]
    }
  }
  const [bounds, setBounds] = React.useState(initialBounds)

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
      <ParameterSelector bounds={bounds} setBounds={setBounds}/>

      <Divider/>
      <Typography align='center'> <b>3. Select optimizer</b> </Typography>
      <OptimizerSelector algorithm={algorithm} setAlgorithm={setAlgorithm} update={setOptimizerOptions}/>
      <JSONTable options={optimizerOptions}/>

      <Divider/>
      <Submitter measurement={measurement} algorithm={algorithm} options={optimizerOptions} instrument={instrument} bounds={bounds}/>
    </div>
  )
}

function mapStateToProps(state){
  // pass entire store state
  return { state }
}
export default connect(mapStateToProps)(OptimizerDrawer)
