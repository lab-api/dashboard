import React from 'react'
import * as actions from '../reducers/actions.js'
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Selector from '../components/Selector.jsx'
import VirtualizedTable from '../components/VirtualizedTable.jsx'
import Plotter from './Plotter.jsx'
import { get } from '../utilities.js'

export default function ResultsDrawer(props) {
  // const [data, setData] = React.useState([])
  // const [columns, setColumns] = React.useState([])
  const [showPlot, setShowPlot] = React.useState(false)
  const [plotterOpen, setPlotterOpen] = React.useState(false)

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
          <Selector source={(callback) => get('/optimistic/results', (newChoices) => callback(newChoices))}
                    callback={(id) => props.setId(id)}
                    label={"Dataset"}/>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={props.loadDataset}> Load </Button>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={()=>{setPlotterOpen(true)}}> Plot </Button>
        </Grid>
      </Grid>
    <Paper> <VirtualizedTable data={props.data} columns={props.columns} height={550} width={props.width}/> </Paper>
    <Plotter open={plotterOpen} setOpen={setPlotterOpen} data={props.data} columns={props.columns}/>
    </Drawer>
  )
}
