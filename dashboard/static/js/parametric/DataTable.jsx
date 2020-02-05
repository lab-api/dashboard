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
import CachedIcon from "@material-ui/icons/Cached";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ParameterRows from './ParameterRows.jsx'
import { connect } from 'react-redux'
import * as actions from '../reducers/actions.js'
import InstrumentRow from './InstrumentRow.jsx'


function DataTable(props) {
  const [expanded, setExpanded] = React.useState([])
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
         <col style={{width:'30%'}}/>
         </colgroup>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
            </TableCell>
            <TableCell align="left" padding="none">
              Knob
            </TableCell>
            <TableCell align="left" padding="none">
              Value
            </TableCell>
            <TableCell align="right" padding="default">
              <div className="row">
              <IconButton aria-label="update" onClick={toggleExpandAll}>
                {expanded.length<props.instruments.length? (<ExpandMoreIcon/>): <ExpandLessIcon/>}
              </IconButton>
              <IconButton aria-label="update">
                <SendIcon />
              </IconButton>
              <IconButton aria-label="refresh">
                <CachedIcon />
              </IconButton>
              <IconButton aria-label="refresh">
                <MoreVertIcon />
              </IconButton>
              </div>
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
  return {instruments: state['instruments'], parameters: state['parameters'], checked: state['checked']}
}
export default connect(mapStateToProps)(DataTable)
