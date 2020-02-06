import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import OptimizerSelector from './OptimizerSelector.jsx'
import JSONTable from './JSONTable.jsx'

export default function OptimizerCard(props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" component="h2">
          Choose an optimization algorithm and tune the parameters below.
        </Typography>
        <div className='col'>
        <div className="row">
          <OptimizerSelector algorithm={props.algorithm} setAlgorithm={props.setAlgorithm} update={props.setOptimizerOptions}/>
        </div>
        <JSONTable options={props.optimizerOptions}/>
        </div>
      </CardContent>
    </Card>
  );
}
