import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MaterialTable from 'material-table'

export default function ResultsTable(props) {

    return (
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          options={{
            paging: false,
            search: false
          }}
          columns={props.columns}
          data={props.data}
          title=""
        />
      </div>
    )

}
