import React from 'react';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {connect} from 'react-redux'
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import * as actions from '../reducers/actions.js'
import IconButton from '@material-ui/core/IconButton';
import {post} from '../utilities.js'

function MonitorPanel(props) {

  // raise alert if any observers are out of bounds
  for (var id in props.observers) {
    if (props.observers[id].bounds[0] != null) {
      if (props.observers[id].bounds[0] > parseFloat(props.observers[id].value)) {
        props.dispatch(actions.alert.show('Monitored variable ' + props.observers[id].name + ' is below threshold!', 'error'))
      }
    }
    if (props.observers[id].bounds[1] != null) {
      if (props.observers[id].bounds[1] < parseFloat(props.observers[id].value)) {
        props.dispatch(actions.alert.show('Monitored variable ' + props.observers[id].name + ' is above threshold!', 'error'))
      }
    }

  }

  const sparklineHeight = 20
  const scaleFactor = 1.1
  function scaleReferenceLine(value, min, max) {
    return 20-20/(max*scaleFactor-min/scaleFactor)*(value-min/scaleFactor)
  }
  return (
    <Drawer elevation={24}
            variant="persistent"
            anchor="right"
            open={props.open}
            className={props.classes.drawer}
            classes={{
              paper: props.classes.drawerPaper,
            }}
    >
      <div>
      <IconButton onClick={()=>post('/monitor/status', {'operation': 'stop'})} >
        <StopIcon/>
      </IconButton>
      <IconButton onClick={()=>post('/monitor/status', {'operation': 'start'})} >
        <PlayArrowIcon/>
      </IconButton>
      <Paper>
      <TableContainer>
        <Table>
        <colgroup>
        < col style={{width:'5%'}}/>
         <col style={{width:'25%'}}/>
         <col style={{width:'15%'}}/>
         <col style={{width:'55%'}}/>
         </colgroup>
        <TableHead>
          <TableRow>
            <TableCell/>
            <TableCell align="left" padding="none">
              <Typography color="primary">Measurement</Typography>
            </TableCell>
            <TableCell align="left" padding="none">
              <Typography color="primary">Value</Typography>
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.observers).map((i) => {
            let min = props.observers[i].bounds[0]
            if (!isFinite(min)) {
              min = Math.min(...props.observers[i].data)
            }
            let max = props.observers[i].bounds[1]
            if (!isFinite(max)) {
              max = Math.max(...props.observers[i].data)
            }
            return (
              <TableRow key={i}>
                <TableCell/>
                <TableCell> {props.observers[i].name} </TableCell>
                <TableCell> {props.observers[i].value} </TableCell>
                <TableCell>
                  <Sparklines data={props.observers[i].data}
                              limit={20}
                              width={100}
                              height={sparklineHeight}
                              min = {min/scaleFactor}
                              max = {max*scaleFactor}
                              margin = {0}
                              >
                    <SparklinesLine style={{ fill: "none", stroke: "#004e67"}} margin={0}/>
                    <SparklinesReferenceLine style={{stroke: "#67001a", strokeWidth:0.5, strokeOpacity: min == null? 0: 0.75, strokeDasharray: '2, 2'}}
                                             type='custom'
                                             value={scaleReferenceLine(min != null? min: 0, min != null? min: 0, max != null? max: 1)}
                                             margin={0} />
                    <SparklinesReferenceLine style={{stroke: "#67001a", strokeWidth: 0.5, strokeOpacity: max == null? 0: 0.75, strokeDasharray: '2, 2'}}
                                             type='custom'
                                             value={scaleReferenceLine(max != null? max: 0, min != null? min: 0, max != null? max: 1)}
                                             margin={0} />
                  </Sparklines>

                </TableCell>

              </TableRow>
            )
            }
          )}
        </TableBody>
        </Table>
      </TableContainer>
      </Paper>
      </div>
    </Drawer>
  )

}

function mapStateToProps(state, ownProps){
  return {observers: state['observers']}
}
export default connect(mapStateToProps)(MonitorPanel)
