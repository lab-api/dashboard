import React from 'react';
import Plot from 'react-plotly.js';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'fixed',
    width: 730,
    height: 460,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
  },
}));

export default function Plotter(props) {
    const classes = useStyles()
    // convert data to format
    const [x, setX] = React.useState([])
    const [y, setY] = React.useState([])
    const [xlabel, setXlabel] = React.useState('')
    const [ylabel, setYlabel] = React.useState('')

    function getModalStyle() {
      return {
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
      };
    }

    function prepareData() {
      if (props.columns.length > 0) {
        const xlabel = props.columns[0].label
        const ylabel = props.columns[1].label
        const x0 = []
        const y0 = []

        for (var i in props.data) {
          x.push(props.data[i][xlabel])
          y.push(props.data[i][ylabel])
        }

        setX(x)
        setY(y)
        setXlabel(xlabel)
        setYlabel(ylabel)
      }
    }

    React.useEffect(prepareData)
    const [modalStyle] = React.useState(getModalStyle);

    function eraseData() {
      props.setOpen(false)
      setX([])
      setY([])
    }

    return (
      <React.Fragment>
      <Modal open={props.open} onClose={eraseData}>
        <div style={modalStyle} className={classes.paper}>
          <div style={{width: '50%', position: 'relative', left: '0%'}}>
            <Plot
              data={[
                {
                  x: x,
                  y: y,
                  type: 'scatter',
                  mode: 'markers',
                },
              ]}
              layout={ {width: 700, height: 450,
                        xaxis: {title: xlabel},
                        yaxis: {title: ylabel, automargin: true}

                      } }
            />
          </div>
        </div>
      </Modal>
      </React.Fragment>
    );
}
