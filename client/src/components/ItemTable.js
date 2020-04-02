import React from 'react'
import {Link} from 'react-router-dom'

export const ItemTable = ( {items, fields} ) => {
  if (!items.length)
  return (
    <h4>Not found items</h4>
  )
    return (
        <div>
          <table style={{borderCollapse:'collapse', border: '4px double black', width: '100%'}}>
          <thead>
          <tr>
              <th>№</th>
              <th>Name</th>
              <th>Tags</th>
              { fields.length > 0 &&
              fields.map((f,ind) => {
                return (
                <th key={ind}> { f.name } </th>
                )
              })
              }
          </tr>
        </thead>
        <tbody> 
            { items.map((item, index) => {
                return (
                     <tr key={item._id}>
                     <td>{ index + 1 }</td>
                     <td><Link to={`/item/${item._id}`}> { item.name } </Link></td>
                     <td>{ item.tags }</td>
                     { fields.length > 0 &&
                     item.custom_fields.map((f) => {
                      return (
                        <td key={f._id}>{ f.value }</td>
                      )
                     })
                      }
                   </tr> 
                )
            }) }
         </tbody>
      </table> 
      </div>
    )
}