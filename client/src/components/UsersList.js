import React from 'react'
import {Link} from 'react-router-dom'

export let arr = [];
export const UsersList = ( {users} ) => {
  const changeCheckSlave = ( () => {
    arr.length = 0;
    const slaves = document.getElementsByClassName('slave');
    for (let i = 0; i < slaves.length; i++) {
      let elem = slaves.item(i)
      if (elem.checked === true)
      {
        arr.push(elem.id);
      }
      else {
        let a = arr.indexOf(elem.id);
        if (!a) {
        arr.splice(a,1);
        }
      }
    }
    const maine = document.getElementsByClassName('main');
    if (arr.length === slaves.length) {
      maine.item(0).checked = true;
    }
    else {
      maine.item(0).checked = false;
    }
  } );
  
    const changeCheckMain = ( () => {
      const maine = document.getElementsByClassName('main');
      const slaves = document.getElementsByClassName('slave');
      const mainCheck = maine.item(0);
      const len = slaves.length;
      arr.length = 0;
      for (let i = 0; i < len; i++)
      {
        let elem = slaves.item(i);
        if (mainCheck.checked === true){
        elem.checked = true;
        arr.push(elem.id);
        }
        else {
          elem.checked = false;
          arr.length = 0;
        }
      }
    });

    return (
        <div>
        <table>
        <thead>
          <tr>
              <th>
                <label>
                <input type="checkbox" className="main" 
                onChange={changeCheckMain}
                />
                <span>All</span>
                </label>
              </th>
              <th>№</th>
              <th>Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>User role</th>
              <th>Date of register</th>
              <th>Date of last Log in</th>
          </tr>
        </thead>

        <tbody>
            { users.map((user, index) => {
                return (
                    <tr key={user._id}>
                    <td>
                      <label>
                      <input type="checkbox" className="slave" id={ user._id }
                      onChange={changeCheckSlave}
                      />
                      <span></span>
                      </label>
                    </td>
                    <td>{ index + 1 }</td>
                    <td><Link to={`profile/${user._id}`}> { user.email } </Link></td>
                    <td>{ user.name }</td>
                    <td>{ user.status }</td>
                    <td>{ user.role }</td>
                    <td>{ new Date(user.dateReg).toLocaleString() }</td>
                    <td>{ new Date(user.dateLog).toLocaleString() }</td>
                  </tr>
                )
            }) }
        </tbody>
      </table>
      </div>
    )
}