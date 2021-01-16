import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import { getUser } from './helpers/Storage';
import LoginLayout from './pages/LoginLayout';
import ResetPassword from './pages/ResetPassword';
import Layout from './pages/Layout';

import './styles/styles.scss';

function App() {
  const currentUser = getUser();
  console.log('currentUser => ', currentUser);
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginLayout}/>
        <Route path="/resetpassword/:token" component={ResetPassword}/>
        <Route path="/">
          { currentUser.email ? <Layout/> : <Redirect to="/login"/> }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
