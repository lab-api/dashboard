import React from 'react'
import ParameterCard from "./ParameterCard.jsx"
import OptimizerCard from "./OptimizerCard.jsx"
import Submitter from "./Submitter.jsx"
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box'
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import * as actions from '../reducers/actions.js'
import Drawer from "@material-ui/core/Drawer";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const ThemeTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontFamily: ['Roboto',].join(','),
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 0.8,
    },
    '&:focus': {
      color: theme.palette.primary.main,
      outline: 'none'
    },
  },
}))(props => <Tab {...props} />);

function OptimizerDrawer(props) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

  return (
    <Drawer elevation={24} variant="persistent" anchor="right" open={props.open} className={props.classes.drawer}
      classes={{
        paper: props.classes.drawerPaper,
      }}>
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        scrollButtons="off"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
      >
        <ThemeTab label="Targets"  {...a11yProps(0)}  />
        <ThemeTab label="Optimizer"  {...a11yProps(1)}  />
      </Tabs>

      <TabPanel value={value} index={0}>
        <ParameterCard/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <OptimizerCard/>
      </TabPanel>

      <Submitter setSnackbarName={props.setSnackbarName} setSnackbarOpen={props.setSnackbarOpen}/>
    </div>
    </Drawer>
  )
}

export default OptimizerDrawer
