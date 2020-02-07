import React from 'react';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Selector from '../components/Selector.jsx'
import { get } from '../utilities.js'
import * as actions from '../reducers/actions.js'

function OptimizerSelector(props) {

  function handleChange(id) {
    props.dispatch(actions.optimization.put('algorithm', id))
    get('/optimistic/algorithms/'.concat(id, '/parameters'),
        (options)=>props.dispatch(actions.optimization.put('settings', options)))
  }

  return (
    <Grid container justify='center'>
      <Selector source={(callback) => get('/optimistic/algorithms', (newChoices) => callback(newChoices))}
                callback={handleChange}
                label={"Algorithm"}
                refresh={false}
                />
    </Grid>
  );
}

export default connect()(OptimizerSelector)
