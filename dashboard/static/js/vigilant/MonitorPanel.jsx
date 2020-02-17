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
import {connect} from 'react-redux'
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import * as actions from '../reducers/actions.js'

function MonitorPanel(props) {
  const monitorId = Object.keys(props.monitors)[0]
  if (monitorId==undefined) {
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
        <Paper>
          <Typography> No monitors detected. </Typography>
        </Paper>
      </Drawer>
    )
  }
  const observerIds = []
  for (var name in props.monitors[monitorId].observers) {
    observerIds.push(props.monitors[monitorId].observers[name])
  }

  // raise alert if any observers are out of bounds
  for (var i in observerIds) {
    const id = observerIds[i]
    if (props.observers[id].bounds[0] > parseFloat(props.observers[id].value)) {
      props.dispatch(actions.alert.show('Monitored variable ' + props.observers[id].name + ' is below threshold!', 'error'))
    }
    else if (props.observers[id].bounds[1] < parseFloat(props.observers[id].value)) {
      props.dispatch(actions.alert.show('Monitored variable ' + props.observers[id].name + ' is above threshold!', 'error'))
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
          {observerIds.map((i) => {
            const min = props.observers[i].bounds[0]
            const max = props.observers[i].bounds[1]
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
                    <SparklinesReferenceLine style={{stroke: "#67001a", strokeWidth:0.5, strokeOpacity: .75, strokeDasharray: '2, 2'}}
                                             type='custom'
                                             value={scaleReferenceLine(min, min, max)}
                                             margin={0} />
                    <SparklinesReferenceLine style={{stroke: "#67001a", strokeWidth: 0.5, strokeOpacity: .75, strokeDasharray: '2, 2'}}
                                             type='custom'
                                             value={scaleReferenceLine(max, min, max)}
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
  return {monitors: state['monitors'],
          observers: state['observers']}
}
export default connect(mapStateToProps)(MonitorPanel)
