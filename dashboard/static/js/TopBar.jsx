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
import SpeedIcon from '@material-ui/icons/Speed';
import TimelineIcon from '@material-ui/icons/Timeline';

export default function ButtonAppBar(props) {
  const useStyles = makeStyles(theme => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      '&:focus': {outline: 'none'},
    },

    button: {    '&:focus': {outline: 'none'},},
    appBarSpacer: theme.mixins.toolbar

  }));

  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            LabAPI
          </Typography>
          <IconButton className = {classes.button} edge="start"
                      onClick = {() => props.setOpenDrawer('Optimize')}
                      color="inherit"
          >
            <SpeedIcon/>
          </IconButton>
          <IconButton className = {classes.button} edge="start"
                      target="_blank" href="http://localhost:3000/d/vigilant-dashboard"
                      color="inherit"
          >
            <TimelineIcon/>
          </IconButton>
          {props.drawerOpen?
          <IconButton className={classes.button} edge="start"
                      aria-label="open-drawer"
                      onClick={props.closeDrawers}
                      color="inherit"
                      aria-label="menu"
                      >
            <ClearIcon />
          </IconButton>
        :null}
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />

    </div>
  );
}
