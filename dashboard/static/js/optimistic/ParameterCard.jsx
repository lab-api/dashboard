import React from 'react';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ParameterSelector from './ParameterSelector.jsx'
import {connect} from 'react-redux'

function ParameterCard(props) {
  let measurementText = ''
  if (props.optimization['objective'] == '') {
    measurementText = 'Select a measurement from the table.'
  }
  else {
    measurementText = 'Selected measurement: ' + props.measurements[props.optimization['objective']].name
  }
  return (
    <React.Fragment>
    <Card>
      <CardContent>
      <Typography>
        {measurementText}
      </Typography>
      </CardContent>
    </Card>
    <Divider/>
    <Card>
      <CardContent>
        <Typography variant="subtitle1" component="h2">
          Select one or more knobs from the table to the left and choose optimization bounds.
        </Typography>
        <ParameterSelector />
      </CardContent>
    </Card>
    </React.Fragment>
  );
}

function mapStateToProps(state){
  return {optimization: state['ui']['optimization'],
          measurements: state['measurements']}
}
export default connect(mapStateToProps)(ParameterCard)
