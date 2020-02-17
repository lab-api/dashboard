import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import * as actions from '../reducers/actions.js'
import IconButton from "@material-ui/core/IconButton";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Selector from '../components/Selector.jsx'
import VirtualizedTable from '../components/VirtualizedTable.jsx'
import Plotter from './Plotter.jsx'
import BarChartIcon from '@material-ui/icons/BarChart';

import { get } from '../utilities.js'

export default function ResultsCard(props) {
  const [showPlot, setShowPlot] = React.useState(false)
  const [plotterOpen, setPlotterOpen] = React.useState(false)
  const [data, setData] = React.useState([])
  const [columns, setColumns] = React.useState([])
  const [id, setId] = React.useState('')

  function loadDataset(id) {
    get('/optimistic/results/'+id, (dataset) => {
      setData(JSON.parse(dataset['records']))
      setColumns(dataset['columns'])
    })
}
  return (
    <React.Fragment>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          style={{ minHeight: '15vh' }}
        >
          <Grid align='center' item xs={9}>
            <Selector source={(callback) => get('/optimistic/results', (newChoices) => callback(newChoices))}
                      callback={(id) => loadDataset(id)}
                      label={"Dataset"}
                      refresh={true}
                      />
          </Grid>

          <Grid item xs={3}>
            <IconButton onClick={()=>{setPlotterOpen(true)}}> <BarChartIcon/> </IconButton>
          </Grid>
        </Grid>
      <Paper> <VirtualizedTable data={data} columns={columns} height={700} width={props.width}/> </Paper>
      <Plotter open={plotterOpen} setOpen={setPlotterOpen} data={data} columns={columns}/>
    </React.Fragment>
  );
}
