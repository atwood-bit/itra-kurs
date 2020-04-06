import React, { useContext } from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/auth.context'
import {useAuth} from '../hooks/auth.hook'

let word = "";
export const Navbar = () => {
    const {token, userRole, userId} = useAuth();
    const auth = useContext(AuthContext);
    const history = useHistory();
    let isAuthenticated;
    if (token) {
    isAuthenticated = !!token;
    }

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        window.location.reload(true);
    }

    const changeHandler = event => {
      word = event.target.value;
  };

    return (
        <nav>
    <div className="nav-wrapper purple darken-3" style ={{ padding: '0 2rem' }}>
      <NavLink to="/" className="brand-logo">Collections</NavLink>
      <ul id="nav-mobile" className="hide-on-med-and-down">
        <li>
       <div className="search-wrapper input-field">
            <input id="search" placeholder="Search" type="search" 
            onChange={changeHandler}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                history.push(`/search_result/${word}`)
                  window.location.reload(true);
              }
            }}
            />
            <label className="label-icon" htmlFor="search">
                <i className="material-icons"
                onClick={() => {
                  history.push(`/search_result/${word}`)
                  window.location.reload(true);
                }}
                >search</i>
              </label>
          </div>
          </li>
          </ul>
      { isAuthenticated && 
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><NavLink to={`/profile/${userId}`}>My collection</NavLink></li>
        { userRole === 'admin' &&  <li><NavLink to={'/users'}>List of users</NavLink></li>}
        <li><a href="/" onClick={logoutHandler}>Logout</a></li>
      </ul>
      }
      { !isAuthenticated &&
        <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><NavLink to="/register">Sign Up</NavLink></li>
        <li><NavLink to="/login">Sign In</NavLink></li>
      </ul>
      }
      {/* <ul id="nav-mobile" className="right hide-on-med-and-down">
      <select className="browser-default select-lang" 
      // defaultValue={lang.language} onChange={(e) => {
      //   lang.language = e.target.value;
      // }}
      >
                    <option value="ru">rus</option>
                    <option value="en">eng</option>
                </select>
</ul> */}
    </div>
  </nav>
  
    )
}