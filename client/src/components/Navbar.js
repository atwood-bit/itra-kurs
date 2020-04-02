import React, { useContext, useCallback, useState } from 'react'
import {NavLink, Link} from 'react-router-dom'
import SearchField from 'react-search-field';
import {AuthContext} from '../context/auth.context'
import {useAuth} from '../hooks/auth.hook'
import { useHttp } from '../hooks/http.hook';

export const Navbar = () => {
    const {token, userRole, userId} = useAuth();
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [form, setForm] = useState({
      text: ''
    });
    let isAuthenticated;
    if (token) {
    isAuthenticated = !!token;
    }
    
    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        window.location.reload(true);
    }

    const search = useCallback( async () => {
      try {
        //console.log(form);
        const fetched = await request(`/api/search/`, 'GET', null);
        console.log(fetched);
    } catch(e) {}
    }, [request])

    return (
        <nav>
    <div className="nav-wrapper purple darken-3" style ={{ padding: '0 2rem' }}>
      <NavLink to="/" className="brand-logo">Collections</NavLink>
       <div className="search-wrapper input-field">
            <input id="search" placeholder="Search" type="search" 
            // value={form.text} name="text"
            // onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
            />
            <label className="label-icon" htmlFor="search"
            onClick= { search }
            >
              {/* <Link to="/"> */}
              <i className="material-icons">search</i>
              {/* </Link> */}
              </label>
          </div>
        {/* <div className="input-field search">
          <input id="search" type="search" required />
          <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
          <i className="material-icons">close</i>
        </div> */}
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
    </div>
  </nav>
  
    )
}