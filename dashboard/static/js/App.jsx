import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from './TopBar.jsx'
import DataTable from './parametric/DataTable.jsx'

export default function App(props){
  return (
    <div>
    <ButtonAppBar/>
    <DataTable/>
    </div>
  )
}
