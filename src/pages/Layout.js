import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

import Home from './Home';
import User from './User';

function Layout() {
  return (
    <>
      <div className="sidebar">
        <div className="title">Dashboard</div>
        <Link to="/">
          <div className="item">
            <i className="fa fa-home mr-3"></i>
            Home
          </div>
        </Link>
        <Link to="/user">
          <div className="item">
            <i className="fa fa-user mr-3"></i>
            User
          </div>
        </Link>
        <Link to="/login">
          <div className="item">
            <i className="fa fa-power-off mr-3"></i>
            Logout
          </div>
        </Link>
      </div>
      <div className="sidebar-content">
        <div className="container">
          <Switch>
            <Route path="/user" component={User}/>
            <Route path="/" component={Home}/>
          </Switch>
        </div>
      </div>
    </>
  )
}

export default Layout;