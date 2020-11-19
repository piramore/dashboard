import React from 'react';
import axios from 'axios';

class LoginLayout extends React.Component {
  state = {
    username: '',
    password: '',
    error: '',
    loginSuccess: false
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  login = async () => {
    const { username, password } = this.state;
    try {
      let loginRequest = await axios.post('http://localhost:3000/user/login', { username, password });
      let loggedUser = loginRequest.data.data;
      localStorage.setItem("user", JSON.stringify({ id: loggedUser.id, username: loggedUser.username }));
      window.location.href = "/";
    }
    catch(err) {
      this.setState({ error: err.response.data.message });
    }
  }

  componentDidMount() {
    localStorage.clear();
  }

  render() {
    return (
      <div className="bg-light" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="card" style={{ width: '300px' }}>
          <div className="card-body">
            <div className="font-weight-bold mb-4" style={{ fontSize: '1.5rem' }}>Login</div>
            <div className="form-group">
              <input className="form-control" type="text" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}/>
            </div>
            <div className="form-group">
              <input className="form-control" type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
            </div>
            <button className="btn btn-block btn-primary" type="submit" onClick={() => this.login()}>Login</button>
            { this.state.error && <div className="mt-2 alert alert-danger">{this.state.error}</div> }
          </div>
        </div>
      </div>
    )
  }
}

export default LoginLayout;