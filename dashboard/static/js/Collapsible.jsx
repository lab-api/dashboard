import React from 'react';
import ReactDOM from 'react-dom';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

export default function Collapsible(props) {
  return (
    <div>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <Typography> {props.name} </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="row" width="100%">
            <div className="col">{props.left}</div>
            <div className="col">{props.right}</div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Divider />
    </div>
  );
}
