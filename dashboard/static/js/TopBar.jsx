import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import red from '@material-ui/core/colors/red';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import OptimizerParameterTable from "./OptimizerParameterTable.jsx"

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {main: "#67001a"},
  },
});

export default function ButtonAppBar() {
  const [open, setOpen] = useState(false)
  function handleDrawerOpen() {
  setOpen(true)
  }

  function handleDrawerClose() {
    setOpen(false)
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" aria-label="open-drawer" onClick={handleDrawerOpen} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            LabAPI
          </Typography>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      <Drawer variant="persistent" anchor="right" open={open}>
      <div>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography align='center'> <b>1. Select independent variables</b> </Typography>
        <OptimizerParameterTable/>
        <Typography align='center'> <b>2. Select dependent variable</b> </Typography>
        <Typography align='center'> <b>3. Select optimizer</b> </Typography>

      </div>
      </Drawer>
    </div>
  );
}
