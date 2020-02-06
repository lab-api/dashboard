import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from '@material-ui/core/styles';
import OptimizerDrawer from './optimistic/OptimizerDrawer.jsx'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import ClearIcon from '@material-ui/icons/Clear';

export default function ButtonAppBar(props) {
  const useStyles = makeStyles(theme => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      '&:focus': {outline: 'none'},
    },
    drawer: {
      width: props.drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: props.drawerWidth,
      paddingTop: 64 // equal to AppBar height

    },
    button: {    '&:focus': {outline: 'none'},},
    appBarSpacer: theme.mixins.toolbar

  }));

  const classes = useStyles();
  const open = props.open
  const setOpen = props.setOpen
  // const [open, setOpen] = useState(false)
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
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            LabAPI
          </Typography>
          {open?
          <IconButton className={classes.button} edge="start" aria-label="open-drawer" onClick={toggleDrawer} color="inherit" aria-label="menu">
            <ClearIcon />
          </IconButton>
        :null}
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />
      <Drawer elevation={24} variant="persistent" anchor="right" open={open} className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <OptimizerDrawer />
      </Drawer>
    </div>
  );
}
