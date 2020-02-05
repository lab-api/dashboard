import React from 'react';
import { connect } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Container from '@material-ui/core/Container'

function MeasurementSelector(props) {
  const [measurementsList, setMeasurementsList] = React.useState([])
  const instruments = Object.keys(props.measurements)
  function getMeasurementsList(instrument) {
    setMeasurementsList(props.measurements[instrument])
    props.setMeasurement(props.measurements[instrument][0])
  }

  function setInitialState() {
    props.setInstrument(instruments[0])
    getMeasurementsList(instruments[0])
  }

  React.useEffect(() => {
    setInitialState()

  }, [])

  function handleInstrumentChange(event) {
    props.setInstrument(event.target.value)
    getMeasurementsList(event.target.value)
  }
  
  function handleChange(event) {
    props.setMeasurement(event.target.value)
  }


  return (
    <Container>
      <div className="row">
        <div className="col">
          <FormControl>
          <Select value={props.instrument} autoWidth={true} variant="outlined" onChange={handleInstrumentChange}>
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
              <Select value={props.measurement} autoWidth={true} variant="outlined" onChange={handleChange}>
              {measurementsList.map((row, index) => {
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
  return {measurements: state['measurements']}
}
export default connect(mapStateToProps)(MeasurementSelector)
