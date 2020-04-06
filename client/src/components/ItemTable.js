import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/auth.context'

let value = 1;
export const ItemTable = ( {items, fields, sort, deleted, owner} ) => {
  const {isAuthenticated, userId, userRole} = useContext(AuthContext);
  const sortHandler = () => {
      sort(value);
      if (value === 1)
      value = -1;
      else value = 1;
  }

  if (!items.length)
  return (
    <h4>Not found items</h4>
  )
    return (
        <div>
          <table className="table">
          <thead>
          <tr>
              <th>№</th>
              <th><a href="#" style={{color: "black"}}><i className="material-icons" name="Name"
              onClick={sortHandler}
              >sort</i></a><span>Name</span> </th>
              <th>Tags</th>
              { fields.length > 0 &&
              fields.map((f,ind) => {
                return (
                <th key={ind}> { f.name } </th>
                )
              })
              }
              <th></th>
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
                     item.custom_fields.map((f, ind) => {
                      return (
                        <td key={f._id}>{(f.type === 'checkbox' && <label>
                        <input type="checkbox" className="slave" disabled="disabled" checked={f.value}
                        />
                        <span></span>
                        </label>) || <span>{ f.value }</span>}
                      </td>
                      )
                     })
                      }
                      {isAuthenticated && (userId === owner || userRole === 'admin') && <td>
                        <div className="right">
                      <Link to={`/item/${item._id}`}><i className="material-icons">edit</i></Link>
                      <a href="#"><i className="material-icons"
                      onClick={() => {deleted(item._id)}}
                      >delete</i></a>
                      </div>
                        </td>}
                   </tr> 
                )
            }) }
         </tbody>
      </table> 
      </div>
    )
}