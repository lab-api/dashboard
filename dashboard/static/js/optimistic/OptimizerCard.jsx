import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import OptimizerSelector from './OptimizerSelector.jsx'
import JSONTable from './JSONTable.jsx'
import Divider from '@material-ui/core/Divider';
import ParameterSelector from './ParameterSelector.jsx'
import {connect} from 'react-redux'
import Submitter from "./Submitter.jsx"
import Grid from '@material-ui/core/Grid'

function OptimizerCard(props) {
  let measurementText = ''
  if (props.optimization['objective'] == '') {
    measurementText = 'Select a measurement from the table.'
  }
  else {
    measurementText = 'Selected measurement: ' + props.measurements[props.optimization['objective']].name
  }
  return (
    <React.Fragment>
    <Grid container spacing={3}>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" component="h2">
            Choose an optimization algorithm and tune the parameters below.
          </Typography>
          <div className='col'>
          <div className="row">
            <OptimizerSelector/>
          </div>
          <JSONTable/>
          </div>
        </CardContent>
      </Card>
      </Grid>
      <Grid item xs={12}>
      <Card>
        <CardContent>
        <Typography>
          {measurementText}
        </Typography>
        </CardContent>
      </Card>
      </Grid>
      <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" component="h2">
            Select one or more knobs from the table to the left and choose optimization bounds.
          </Typography>
          <ParameterSelector />
        </CardContent>
      </Card>
      </Grid>
      <Submitter/>
    </Grid>
    </React.Fragment>
  );
}

function mapStateToProps(state){
  return {optimization: state['ui']['optimization'],
          measurements: state['measurements']}
}
export default connect(mapStateToProps)(OptimizerCard)
