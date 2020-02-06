import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedIcon from '@material-ui/icons/Speed';

const useStyles = makeStyles(theme => ({
  root: {
    height: 280,
    flexGrow: 1,
    '&:focus': {outline: 'none'},
  },
  speedDial: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    '&:focus': {outline: 'none'},
  },
}));

const actions = [
  { icon: <SpeedIcon />, name: 'Optimize'},
];

export default function SpeedDialTooltipOpen(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (name) => {
    if (name == 'Optimize') {
      props.setDrawer(true)
    }
    setOpen(false);

  };

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => handleClose(action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
