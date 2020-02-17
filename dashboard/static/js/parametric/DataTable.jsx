import React from 'react';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from "@material-ui/core/Checkbox";
import CachedIcon from "@material-ui/icons/Cached";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ParameterRows from './ParameterRows.jsx'
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import InstrumentRow from './InstrumentRow.jsx'
import { get } from '../utilities.js'
import produce from 'immer'

function DataTable(props) {
  const [expanded, setExpanded] = React.useState([])

  function deselectAll() {
    props.dispatch(actions.checked.uncheck(props.checked))
  }

  function refreshChecked() {
    for (var i in props.checked) {
      const id = props.checked[i]
      get('/knobs/' + id , (value) => {
        props.dispatch(actions.knobs.update(id, value))
        props.dispatch(actions.ui.patch('knobs', id, 'display', ''))
      })

    }
    deselectAll()
  }

  function toggleExpandAll() {
    const instrument_names = Object.keys(props.instruments)
    if (expanded.length < instrument_names.length) {
      setExpanded(instrument_names)
    }
    else {
      setExpanded([])
    }
  }
  const topLevelInstruments = []
  for (var id in props.instruments) {
    if (props.instruments[id]['parent'] == null) {
      topLevelInstruments.push(id)
    }
  }
  return (
    <React.Fragment>
    <Paper>
      <TableContainer>
        <Table>
        <colgroup>
         <col style={{width:'10%'}}/>
         <col style={{width:'30%'}}/>
         <col style={{width:'30%'}}/>
         <col style={{width:'25%'}}/>
         <col style={{width:'5%'}}/>

         </colgroup>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
            </TableCell>
            <TableCell align="left" padding="none">
              <Typography color="primary">Knob</Typography>
            </TableCell>
            <TableCell align="left" padding="none">
              <Typography color="primary">Value</Typography>
            </TableCell>
            <TableCell align="right" padding="default">
              <div className="row">
              <IconButton aria-label="refresh" onClick={refreshChecked} color="primary">
                <CachedIcon />
              </IconButton>
              </div>
            </TableCell>
            <TableCell align='right' padding='default'>
              <IconButton aria-label="update" onClick={toggleExpandAll} color="primary">
                {expanded.length<Object.keys(props.instruments).length? (<ExpandMoreIcon/>): <ExpandLessIcon/>}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topLevelInstruments.map((id, i) => (
            <InstrumentRow key={props.instruments[id]['name']}
                           expanded={expanded}
                           setExpanded={setExpanded}
                           instrumentID={id}
                           backgroundColor={"#D3D3D3"}
                           />
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </React.Fragment>
  )

}

function mapStateToProps(state, ownProps){
  return {instruments: state['instruments'],
          checked: state['checked'],
          knobs: state['knobs'],
          ui: state['ui'],
          alert: state['alert']}
}
export default connect(mapStateToProps)(DataTable)
