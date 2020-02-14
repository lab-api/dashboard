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
import MeasurementRows from './MeasurementRows.jsx'
import SwitchRows from './SwitchRows.jsx'
import SelectorRows from './SelectorRows.jsx'

import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'

function InstrumentRow(props) {
  const handleExpandClick = () => {
    if (props.expanded.includes(props.instrumentID))
    {
      props.setExpanded(props.expanded.filter(name => name != props.instrumentID))
    }
    else {
      props.setExpanded(props.expanded.concat(props.instrumentID))
    }
  }

  function getChildKnobs(parent_id) {
    let childKnobs = []
    for (var i in props.instruments[parent_id].children) {
      const child_id = props.instruments[parent_id].children[i]
      childKnobs = childKnobs.concat(props.instruments[child_id].knobs)
      childKnobs = childKnobs.concat(getChildKnobs(child_id))
    }
    return childKnobs
  }

  const knobs = props.instrument.knobs
  const descendantKnobs = getChildKnobs(props.instrumentID)
  const allKnobs = knobs.concat(descendantKnobs)

  const checkedInInstrument = props.checked.filter(id => allKnobs.some(id2 => id == id2))
  const isIndeterminate = checkedInInstrument.length > 0 && checkedInInstrument.length < allKnobs.length
  const isChecked = checkedInInstrument.length == allKnobs.length

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      selectAll()
      return;
    }
    deselectAll()
  };

  function selectAll() {
    props.dispatch(actions.checked.check(allKnobs))
  }

  function deselectAll() {
    props.dispatch(actions.checked.uncheck(allKnobs))
  }

  return (
    <React.Fragment>
    <TableRow key={props.instrumentID} style={{background: props.backgroundColor}} hover>
      <TableCell padding="checkbox">
        <Checkbox indeterminate={isIndeterminate}
                  checked={isChecked}
                  onChange={handleSelectAllClick}
                  color="primary"/>
      </TableCell>
      <TableCell align="left" padding="none"><b>{props.instrument.name}</b></TableCell>
      <TableCell/>
      <TableCell>
      </TableCell>
      <TableCell align='right' padding='default'>
        <IconButton aria-label="show more" edge='start' size='small' onClick={()=>handleExpandClick(props.instrumentID)}>
          {props.expanded.includes(props.instrumentID)? (<ExpandLessIcon />): <ExpandMoreIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
    {props.expanded.includes(props.instrumentID)? (
      <SwitchRows instrumentID={props.instrumentID}/>
      ): null
    }
    {props.expanded.includes(props.instrumentID)? (
      <SelectorRows instrumentID={props.instrumentID}/>
      ): null
    }
    {props.expanded.includes(props.instrumentID)? (
      <ParameterRows instrumentID={props.instrumentID}/>
      ): null
    }
    {props.expanded.includes(props.instrumentID)? (
      <MeasurementRows instrumentID={props.instrumentID}/>
      ): null
    }

    {props.instrument.children.map((id, i) => (
      props.expanded.includes(props.instrumentID)? (
      <WrappedInstrumentRow key={props.instruments[id]['name']}
                     expanded={props.expanded}
                     setExpanded={props.setExpanded}
                     instrumentID={id}
                     />
                   ): null
    ))
    }
    </React.Fragment>
  );
}

function mapStateToProps(state, ownProps){
  return {knobs: state['knobs'],
          instrument: state['instruments'][ownProps.instrumentID],
          checked: state['checked'],
          instruments: state['instruments']
        }
}

const WrappedInstrumentRow = connect(mapStateToProps)(InstrumentRow)

export default connect(mapStateToProps)(InstrumentRow)
