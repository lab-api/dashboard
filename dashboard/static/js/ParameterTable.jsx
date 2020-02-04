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
  const rows = []
  const values = props.state[props.instrument]['parameters']
  for (var param in values) {
    rows.push({name: param, value: values[param]})
  }
  const instrument = props.instrument;
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      selectAll()
      return;
    }
    deselectAll()
  };

  const handleClick = (event, name) => {
    props.dispatch({'type': 'toggle', 'instrument': instrument, 'name': name})
  };

  function selectAll() {
    props.dispatch({'type': 'check', 'instrument': instrument, 'names': Object.keys(values)})
  }

  function deselectAll() {
    props.dispatch({'type': 'uncheck', 'instrument': instrument, 'names': Object.keys(values)})
  }

  function send() {
    const state = props.state[instrument]['checked']
    for (var i in state) {
      const name = state[i]
      const textid = instrument.concat('-', name, '-text')
      const element = document.getElementById(textid)
      let text = element.value
      if (text == '') {
        text = element.placeholder
      }
      props.dispatch({'type': 'update',
                      'instrument': instrument,
                      'parameter': name,
                      'value': parseFloat(text)})
      const url = prefix.concat(name, '/set/', text)
      element.value = ''
      get(url)
    }
    refresh()
  }

  function refresh() {
    const state = props.state[props.instrument]['checked']
    for (var i in state) {
      const name = state[i]
      const textid = props.instrument.concat('-', name, '-text')
      get(prefix.concat(name, '/get'), function (val){
                  const element = document.getElementById(textid)
                  element.value = ''
                  props.dispatch({'type': 'update',
                                        'instrument': props.instrument,
                                        'parameter': name,
                                        'value': parseFloat(val)})}
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
              indeterminate={props.state[instrument]['checked'].length>0 && props.state[instrument]['checked'].length<rows.length}
              selected={props.state[instrument]['checked'].length==rows.length}
              send={send}
              refresh={refresh}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = props.state[instrument]['checked'].includes(row.name)
                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    id={instrument.concat('-', row.name, '-row')}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        id={instrument.concat('-', row.name, '-check')}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      <Input placeholder={props.state[instrument]['parameters'][row.name].toString()}
                             id={instrument.concat('-', row.name, '-text')} />
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

function mapStateToProps(state){
  // pass entire store state
  return { state }
}
export default connect(mapStateToProps)(ParameterTable)
