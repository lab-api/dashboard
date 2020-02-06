import React from 'react';
import { connect } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Container from '@material-ui/core/Container'
import * as actions from '../reducers/actions.js'

function MeasurementSelector(props) {
  const measurementChoices = props.measurementChoices
  const setMeasurementChoices = props.setMeasurementChoices
  const instruments = Object.keys(props.measurements)

  function getMeasurementChoices(instrument) {
    setMeasurementChoices(props.measurements[instrument])
    props.dispatch(actions.optimization.put('objective', props.measurements[instrument][0]))
  }

  function setInitialState() {
    getMeasurementChoices(instruments[0])
    props.dispatch(actions.optimization.put('instrument', instruments[0]))

  }

  React.useEffect(() => {
    if (props.optimization.objective == "")
    {
      setInitialState()
    }
  }, [])

  function handleInstrumentChange(event) {
    props.dispatch(actions.optimization.put('instrument', event.target.value))
    getMeasurementChoices(event.target.value)
  }

  function handleChange(event) {
    props.dispatch(actions.optimization.put('objective', event.target.value))
  }


  return (
    <Container>
      <div className="row">
        <div className="col">
          <FormControl>
          <Select value={props.optimization['instrument']} autoWidth={true} variant="outlined" onChange={handleInstrumentChange}>
            {instruments.map((row, index) => {
              return (
              <MenuItem key={row} value={row}>{row}</MenuItem>
            )
            })}
          </Select>
          <FormHelperText>Instrument</FormHelperText>
          </FormControl>
          </div>
          <div className="col">
            <FormControl>
              <Select value={props.optimization['objective']} autoWidth={true} variant="outlined" onChange={handleChange}>
              {measurementChoices.map((row, index) => {
                return (
                <MenuItem key={row} value={row}>{row}</MenuItem>
              )
              })}
              </Select>
              <FormHelperText>Parameter</FormHelperText>
            </FormControl>
          </div>
        </div>
    </Container>
  );
}

function mapStateToProps(state, ownProps){
  return {measurements: state['measurements'], optimization: state['optimization']}
}
export default connect(mapStateToProps)(MeasurementSelector)
