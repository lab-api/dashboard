import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from './TopBar.jsx'
import DataTable from './parametric/DataTable.jsx'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SpeedDial from './SpeedDial.jsx'
import OptimizerDrawer from './optimistic/OptimizerDrawer.jsx'
import ResultsDrawer from './optimistic/ResultsDrawer.jsx'
import ResultSnackbar from './optimistic/ResultSnackbar.jsx'
import AlertSnackbar from './AlertSnackbar.jsx'
import { get } from './utilities.js'

// problem: using a single state to define the open drawer causes all drawers to re-render each time one is changed

const theme = createMuiTheme({
  palette: {
    primary: {main: "#67001a"},
    secondary: {main: '#004e67'}
  },
});

const drawerWidth = 500
const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(3),
    marginRight: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: 64 // equal to AppBar height
  },
}));

export default function App(props){
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = React.useState('')
  const [snackbarName, setSnackbarName] = React.useState('')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  const [data, setData] = React.useState([])
  const [columns, setColumns] = React.useState([])
  const [id, setId] = React.useState('')

  function closeDrawers() {
    setOpenDrawer('')
    setData([])
    setColumns([])
  }


  function loadDataset() {
    const url = '/optimistic/results/'.concat(id)
    get(url, (dataset) => {
      setData(JSON.parse(dataset['records']))
      setColumns(dataset['columns'])
    })
    setOpenDrawer('Results')
  }

  return (
    <div>
    <ThemeProvider theme={theme}>
    <ButtonAppBar drawerOpen={openDrawer != ''} closeDrawers={closeDrawers} />
    <main
      className={classes.content}
    >
    <DataTable/>


    <OptimizerDrawer open={openDrawer=='Optimize'} classes={classes} setSnackbarName={setSnackbarName} setSnackbarOpen={setSnackbarOpen} />
    <ResultsDrawer open={openDrawer=='Results'} classes={classes} width={drawerWidth} setId={setId} data={data} setData={setData} columns={columns} setColumns={setColumns} loadDataset={loadDataset} />

    </main>
    <SpeedDial setOpenDrawer={setOpenDrawer}/>
    <AlertSnackbar/>
    <ResultSnackbar name={snackbarName} setName={setSnackbarName} open={snackbarOpen} setOpen={setSnackbarOpen} loadDataset={loadDataset}/>
    </ThemeProvider>
    </div>

  )
}
