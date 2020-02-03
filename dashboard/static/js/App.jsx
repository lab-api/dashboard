import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from './TopBar.jsx'
import InstrumentPanel from './InstrumentPanel.jsx'

export default function App(props){
  return (
    <div>
    <ButtonAppBar/>
    {Object.keys(props.parameters).map((instrument, index) => {
      return (<InstrumentPanel instrument={instrument}
                               parameters={props.parameters}
                               key={instrument} />)})
    }
    </div>
  )
}
