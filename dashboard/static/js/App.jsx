import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from './TopBar.jsx'
import DataTable from './parametric/DataTable.jsx'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SpeedDial from './SpeedDial.jsx'
import OptimizerDrawer from './optimistic/OptimizerDrawer.jsx'
import AlertSnackbar from './AlertSnackbar.jsx'
import MonitorPanel from './vigilant/MonitorPanel.jsx'
import { get } from './utilities.js'
import * as actions from './reducers/actions.js'

const theme = createMuiTheme({
  palette: {
    primary: {main: "#67001a"},
    secondary: {main: '#004e67'}
  },
});

const drawerWidth = 500
const monitorWidth = 0
const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(3),
    marginRight: drawerWidth + monitorWidth
  },
  monitor: {
    width: monitorWidth
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

  props.socket.on('parameter', (data) => {
    props.dispatch(actions.knobs.update(data.id, data.value))
    props.dispatch(actions.ui.patch('knobs', data.id, 'display', ''))
  })

  props.socket.on('monitor', (data) => {
    for (var observerId in data.values) {
      props.dispatch(actions.observers.update(observerId, data.values[observerId]))
    }
  })

  function closeDrawers() {
    setOpenDrawer('')
  }

  return (
    <div>
    <ThemeProvider theme={theme}>
    <ButtonAppBar drawerOpen={openDrawer != ''} closeDrawers={closeDrawers} />
    <main
      className={classes.content}
    >
    <DataTable/>
    <MonitorPanel open={openDrawer=='Monitor'} classes={classes}/>
    <OptimizerDrawer open={openDrawer=='Optimize'}
                     classes={classes}
                     width={drawerWidth}
                     />

    </main>
    <SpeedDial setOpenDrawer={setOpenDrawer}/>
    <AlertSnackbar/>
    </ThemeProvider>
    </div>

  )
}
