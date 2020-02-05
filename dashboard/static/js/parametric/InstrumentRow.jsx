import React from 'react';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from "@material-ui/core/Checkbox";
import ParameterRows from './ParameterRows.jsx'
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'

function InstrumentRow(props) {
  const names = Object.keys(props.parameters)

  const handleExpandClick = () => {
    if (props.expanded.includes(props.instrument))
    {
      props.setExpanded(props.expanded.filter(name => name != props.instrument))
    }
    else {
      props.setExpanded(props.expanded.concat(props.instrument))
    }
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      selectAll()
      return;
    }
    deselectAll()
  };

  function selectAll() {
    props.dispatch(actions.check(props.instrument, names))
  }

  function deselectAll() {
    props.dispatch(actions.uncheck(props.instrument, names))
  }

  return (
    <React.Fragment>
    <TableRow key={props.instrument} style={{background: "#D3D3D3"}} hover>
      <TableCell padding="checkbox">
        <Checkbox indeterminate={props.checked.length>0 && props.checked.length<names.length}
                  checked={props.checked.length==names.length}
                  onChange={handleSelectAllClick}/>
      </TableCell>
      <TableCell align="left" padding="none"><b>{props.instrument}</b></TableCell>
      <TableCell/>
      <TableCell>
        <IconButton aria-label="show more" edge='start' size='small' onClick={()=>handleExpandClick(props.instrument)}>
          {props.expanded.includes(props.instrument)? (<ExpandLessIcon />): <ExpandMoreIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
    {props.expanded.includes(props.instrument)? (
      <ParameterRows instrument={props.instrument}/>
      ): null
    }
    </React.Fragment>
  );
}

function mapStateToProps(state, ownProps){
  return {parameters: state['parameters'][ownProps['instrument']], checked: state['checked'][ownProps['instrument']]}
}

export default connect(mapStateToProps)(InstrumentRow)
