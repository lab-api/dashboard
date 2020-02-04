import React from 'react'
import OptimizerSelector from './OptimizerSelector.jsx'
import ParameterSelector from "./ParameterSelector.jsx"
import MeasurementSelector from "./MeasurementSelector.jsx"
import Submitter from "./Submitter.jsx"
import JSONTable from './JSONTable.jsx'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

  const [expanded, setExpanded] = React.useState(false);
  const handleExpansion = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Typography align='center' variant="h4">
        Optimization
      </Typography>
      <Divider/>
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleExpansion('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography> <b>Select dependent variable</b></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <MeasurementSelector measurement={measurement} setMeasurement={setMeasurement} instrument={instrument} setInstrument={setInstrument}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleExpansion('panel2')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography> <b>Select independent variables</b></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ParameterSelector bounds={bounds} setBounds={setBounds}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleExpansion('panel3')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography> <b> Select optimizer </b></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className='col'>
          <div className="row">
            <OptimizerSelector algorithm={algorithm} setAlgorithm={setAlgorithm} update={setOptimizerOptions}/>
          </div>
          <JSONTable options={optimizerOptions}/>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Submitter measurement={measurement} algorithm={algorithm} options={optimizerOptions} instrument={instrument} bounds={bounds}/>
    </div>
  )
}

function mapStateToProps(state){
  // pass entire store state
  return { state }
}
export default connect(mapStateToProps)(OptimizerDrawer)
