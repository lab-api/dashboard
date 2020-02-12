import React from 'react';
import { connect } from 'react-redux'
import Container from '@material-ui/core/Container'
import Selector from '../components/Selector.jsx'
import * as actions from '../reducers/actions.js'

function MeasurementSelector(props) {

  function listMeasurements(callback) {
    const instrument = props.optimization.instrument
    if (instrument=='') {
      callback([])
    }
    else {
      callback(props.measurements[instrument])
    }
  }

  return (
    <Container>
      <div className="row">
        <div className="col">
          <Selector source={(callback) => callback(Object.keys(props.measurements))}
                    callback={(id) => props.dispatch(actions.ui.optimization.put('instrument', id))}
                    label={"Instrument"}
                    refresh={false}
                    />
          </div>

          <div className="col">
            <Selector source={(callback) => listMeasurements(callback)}
                      callback={(id) => props.dispatch(actions.ui.optimization.put('objective', id))}
                      label={"Measurement"}
                      refresh={true}
                      />
          </div>
        </div>
    </Container>
  );
}

function mapStateToProps(state){
  return {measurements: state['measurements'],
          optimization: state['ui']['optimization']}
}
export default connect(mapStateToProps)(MeasurementSelector)
