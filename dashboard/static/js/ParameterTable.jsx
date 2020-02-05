import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import SendIcon from "@material-ui/icons/Send";
import Input from '@material-ui/core/Input';
import get from './utilities.js'
import { connect } from 'react-redux'
import * as actions from './reducers/actions.js'

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={props.indeterminate}
            checked={props.selected}
            onChange={props.onSelectAllClick}
          />
        </TableCell>
        <TableCell align="left" padding="none">
          Knobs{" "}
        </TableCell>
        <TableCell align="right" padding="default">
          <div className="row">
          <IconButton aria-label="update" onClick={props.send}>
            <SendIcon />
          </IconButton>
          <IconButton aria-label="refresh" onClick={props.refresh}>
            <CachedIcon />
          </IconButton>
          </div>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function ParameterTable(props) {
  const prefix = '/instruments/'.concat(props.instrument, '/parameters/')
  const names = Object.keys(props.parameters)

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      selectAll()
      return;
    }
    deselectAll()
  };

  const handleClick = (event, name) => {
    props.dispatch(actions.toggle(props.instrument, name))
  };

  function selectAll() {
    props.dispatch(actions.check(props.instrument, names))
  }

  function deselectAll() {
    props.dispatch(actions.uncheck(props.instrument, names))
  }

  function send() {
    for (var i in props.checked) {
      const name = props.checked[i]
      const textid = props.instrument.concat('-', name, '-text')
      const element = document.getElementById(textid)
      let text = element.value
      if (text == '') {
        text = element.placeholder
      }
      props.dispatch(actions.updateParameter(props.instrument, name, parseFloat(text)))
      const url = prefix.concat(name, '/set/', text)
      element.value = ''
      get(url)
    }
    refresh()
  }

  function refresh() {
    for (var i in props.checked) {
      const name = props.checked[i]
      const textid = props.instrument.concat('-', name, '-text')
      get(prefix.concat(name, '/get'), function (val){
                  const element = document.getElementById(textid)
                  element.value = ''
                  props.dispatch(actions.updateParameter(props.instrument, name, parseFloat(val)))}
            )
      }
    deselectAll()
  }
  return (
    <div>
      <Paper>
        <TableContainer>
          <Table
            id="fancy-table"
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              indeterminate={props.checked.length>0 && props.checked.length<names.length}
              selected={props.checked.length==names.length}
              send={send}
              refresh={refresh}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {names.map((name, index) => {
                const isItemSelected = props.checked.includes(name)
                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={name}
                    id={props.instrument.concat('-', name, '-row')}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        id={props.instrument.concat('-', name, '-check')}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {name}
                    </TableCell>
                    <TableCell align="right">
                      <Input placeholder={props.parameters[name].toString()}
                             id={props.instrument.concat('-', name, '-text')} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

function mapStateToProps(state, ownProps){
  return {parameters: state['parameters'][ownProps.instrument], checked: state['checked'][ownProps.instrument]}
}
export default connect(mapStateToProps)(ParameterTable)
