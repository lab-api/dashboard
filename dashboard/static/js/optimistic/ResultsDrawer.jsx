import React from 'react'
import * as actions from '../reducers/actions.js'
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Selector from '../components/Selector.jsx'
import ResultsTable from './ResultsTable.jsx'
import { get } from '../utilities.js'

export default function ResultsDrawer(props) {
  // const [data, setData] = React.useState([])
  // const [columns, setColumns] = React.useState([])

  function updateCurrentItem(id) {
    props.setId(id)
  }

  return (
    <Drawer elevation={24} variant="persistent" anchor="right" open={props.open} className={props.classes.drawer}
      classes={{
        paper: props.classes.drawerPaper,
      }}>
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justify="center"
        style={{ minHeight: '15vh' }}
      >
        <Grid item xs={3}>
          <Selector url={'/optimistic/results'} callback={updateCurrentItem} label={"Dataset"}/>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={props.loadDataset}> Load </Button>
        </Grid>
      </Grid>
    <Paper> <ResultsTable data={props.data} columns={props.columns}/> </Paper>
    </Drawer>
  )
}
