import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Admin from './Admin';
import Settings from './SettingsPage/Settings';
import MyProfile from './MyProfile';
import ChangePassword from './ChangePassword';

function Layout() {
  return (
    <>
      {/* <div className="sidebar">
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
        <Link to="/admin">
          <div className="item">
            <i className="fa fa-user mr-3"></i>
            Admin
          </div>
        </Link>
        <Link to="/login">
          <div className="item">
            <i className="fa fa-power-off mr-3"></i>
            Logout
          </div>
        </Link>
      </div> */}
      <div className="sidebarr-content">
        <div className="container">
          <Switch>
            <Route path="/admin" component={Admin}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/myprofile" component={MyProfile}/>
            <Route path="/changepassword" component={ChangePassword}/>
            <Route path="/" component={Home}/>
          </Switch>
        </div>
      </div>
    </>
  )
}

export default Layout;