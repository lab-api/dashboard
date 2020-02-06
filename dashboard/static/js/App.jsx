import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from './TopBar.jsx'
import DataTable from './parametric/DataTable.jsx'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SpeedDial from './SpeedDial.jsx'

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
}));

export default function App(props){
  const classes = useStyles();
  const [open, setOpen] = React.useState(false)

  return (
    <div>
    <ThemeProvider theme={theme}>
    <ButtonAppBar open={open} setOpen={setOpen} drawerWidth={drawerWidth}/>
    <main
      className={classes.content}
    >
    <DataTable/>

    </main>
    <SpeedDial setDrawer={setOpen}/>

    </ThemeProvider>
    </div>

  )
}
