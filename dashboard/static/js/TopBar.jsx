import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SpeedIcon from '@material-ui/icons/Speed';
import red from '@material-ui/core/colors/red';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import OptimizerDrawer from './optimistic/OptimizerDrawer.jsx'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {main: "#67001a"},
  },
});


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: 400,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 400,
    paddingTop: 64 // equal to AppBar height

  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBarSpacer: theme.mixins.toolbar

}));



export default function ButtonAppBar() {
  const classes = useStyles();

  const [open, setOpen] = useState(false)
  function toggleDrawer() {
    if (open) {
      setOpen(false)
    }
    else {
      setOpen(true)
    }
  }
  function handleDrawerOpen() {
  setOpen(true)
  }

  function handleDrawerClose() {
    setOpen(false)
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>

          <Typography variant="h6" style={{ flex: 1 }}>
            LabAPI
          </Typography>
          <IconButton edge="start" aria-label="open-drawer" onClick={toggleDrawer} color="inherit" aria-label="menu">
            <SpeedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      <div className={classes.appBarSpacer} />
      <Drawer variant="persistent" anchor="right" open={open} className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <OptimizerDrawer />
      </Drawer>
    </div>
  );
}
