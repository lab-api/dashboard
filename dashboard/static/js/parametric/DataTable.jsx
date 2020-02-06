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
import get from '../utilities.js'

function DataTable(props) {
  const [expanded, setExpanded] = React.useState([])

  function deselectAll() {
    for (var instrument in props.parameters) {
      props.dispatch(actions.checked.patch(instrument, Object.keys(props.parameters[instrument]), false))
    }
  }
  function send() {
    for (var instrument in props.checked) {
      for (var i in props.checked[instrument]) {
        const instrument_name = instrument
        const name = props.checked[instrument][i]

        const text = props.inputs[instrument][name]
        if (text == null) {
          text = props.parameters[instrument][name]
        }

        const url = '/instruments/'.concat(instrument, '/parameters/', name, '/set/', text)
        props.dispatch(actions.updateParameter(instrument_name, name, parseFloat(text)))
        props.dispatch(actions.updateInput(instrument_name, name, ''))

        get(url)
      }
    }
    refresh()
  }

  function updateParameter(instrument, name, value) {
    props.dispatch(actions.updateParameter(instrument, name, parseFloat(value)))
    props.dispatch(actions.updateInput(instrument, name, ''))
  }

  function refresh() {
    for (var instrument in props.checked) {
      for (var i in props.checked[instrument]) {
        const instrument_name = instrument
        const name = props.checked[instrument][i]
        const url = '/instruments/'.concat(instrument, '/parameters/', name, '/get')
        get(url, (value) => updateParameter(instrument_name, name, value))
      }
    }
    deselectAll()
  }

  function toggleExpandAll() {
    if (expanded.length < props.instruments.length) {
      setExpanded(props.instruments)
    }
    else {
      setExpanded([])
    }
  }
  return (
    <React.Fragment>
    <Paper>
      <TableContainer>
        <Table>
        <colgroup>
         <col style={{width:'10%'}}/>
         <col style={{width:'20%'}}/>
         <col style={{width:'40%'}}/>
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
              <IconButton aria-label="update" onClick={send} color="primary">
                <SendIcon />
              </IconButton>
              <IconButton aria-label="refresh" onClick={refresh} color="primary">
                <CachedIcon />
              </IconButton>
              <IconButton aria-label="more-vert" color="primary">
                <MoreVertIcon />
              </IconButton>
              </div>
            </TableCell>
            <TableCell align='right' padding='default'>
              <IconButton aria-label="update" onClick={toggleExpandAll} color="primary">
                {expanded.length<props.instruments.length? (<ExpandMoreIcon/>): <ExpandLessIcon/>}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.instruments.map((instrument, i) => (
            <InstrumentRow key={instrument} instrument={instrument} expanded={expanded} setExpanded={setExpanded}/>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </React.Fragment>
  )

}

function mapStateToProps(state, ownProps){
  return {instruments: state['instruments'], parameters: state['parameters'], checked: state['checked'], inputs: state['inputs']}
}
export default connect(mapStateToProps)(DataTable)
