import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook'
import {useRoutes} from './routes'
import {AuthContext} from './context/auth.context'
import {LanguageContext} from './context/language.context'
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import 'materialize-css';

function App() {
  const {token, login, logout, userId, ready, userRole} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(userRole, isAuthenticated);
if (!ready) {
  return <Loader/>
}

  return (
    <AuthContext.Provider value ={{
      token, login, logout, userId, isAuthenticated, userRole
    }}>
      <Router>
       <Navbar />
      <div className="container">
        {routes}
      </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
