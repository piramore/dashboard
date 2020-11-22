import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import LoginLayout from './pages/LoginLayout';
import ResetPassword from './pages/ResetPassword';
import Layout from './pages/Layout';

import './styles/styles.scss';

function App() {
  const currentUser = localStorage.getItem("user");
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginLayout}/>
        <Route path="/reset_password/:token" component={ResetPassword}/>
        <Route path="/">
          { currentUser ? <Layout/> : <Redirect to="/login"/> }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
