import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ParameterSelector from './ParameterSelector.jsx'

export default function ParameterCard(props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" component="h2">
          Select one or more knobs from the table to the left and choose optimization bounds.
        </Typography>
        <ParameterSelector />
      </CardContent>
    </Card>
  );
}
