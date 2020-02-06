import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MeasurementSelector from './MeasurementSelector.jsx'

export default function MeasurementCard(props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" component="h2">
          Select a Measurement to optimize.
        </Typography>
        <MeasurementSelector measurementChoices={props.measurementChoices}
                             setMeasurementChoices={props.setMeasurementChoices}
        />
      </CardContent>
    </Card>
  );
}
