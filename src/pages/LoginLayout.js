import React from 'react';
import axios from 'axios';
import { Alert, Modal, Button, Spinner } from 'react-bootstrap';

import { SERVICE_HOST } from '../configs/Host.config';

class LoginLayout extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    error: '',
    loginSuccess: false,
    resetPasswordModal: false
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  login = async () => {
    const { email, password } = this.state;
    try {
      let loginRequest = await axios.post(`/api/login`, { email, password }, );

      if (loginRequest.data.success == "false") throw loginRequest.data.message;

      let loggedUser = loginRequest.data.admin;

      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", loginRequest.data.token);
      window.location.href = "/";
    }
    catch(err) {
      if (err.response) this.setState({ error: err.response.data.message });
      else if (typeof err == 'string') this.setState({ error: err });
      else this.setState({ error: 'Cannot conenct to server' });
    }
  }

  openResetPasswordModal = (e) => {
    e.preventDefault();
    this.setState({ resetPasswordModal: true });
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
              <input className="form-control" type="text" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
            </div>
            <div className="form-group">
              <input className="form-control" type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
            </div>
            <button className="btn btn-block btn-primary" type="submit" onClick={() => this.login()}>Login</button>
            <div className="text-right mt-2">
              <a href="#" className="text-primary" onClick={this.openResetPasswordModal}>Forget Password?</a>
            </div>
            { this.state.error && <div className="mt-2 alert alert-danger">{this.state.error}</div> }


            <Modal show={this.state.resetPasswordModal} onHide={() => this.setState({ resetPasswordModal: false })}>
                <ModalResetPassword
                    onClose={() => this.setState({ resetPasswordModal: false })}>
                </ModalResetPassword>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}

class ModalResetPassword extends React.Component {
  constructor(props) {
      super(props);
  }

  state = {
      alertSuccess: '',
      alertError: '',
      email: '',
      loading: false
  }

  handleEmail = (e) => this.setState({ email: e.target.value });
  
  resetPassword = async () => {
      const params = {
        email: this.state.email
      }

      try {
        this.setState({ loading: true });
        const updateReq = await axios.post(`/api/forgotpassword`, params);
        this.setState({ loading: false });
        if (updateReq.data.success) {
          this.setState({ alertSuccess: updateReq.data.message, alertError: "" });
        } else {
          this.setState({ alertSuccess: '', alertError: updateReq.data.message });
        }
      }

      catch(err) {
        this.setState({ loading: false });
        let message;
        if (err.response) message = err.response.data.message;
        this.setState({
            alertError: message || "Failed requesting password reset!",
            alertSuccess: ''
        });
        console.log(err);
      }
  }

  render() {
      return (
          <>
              <Modal.Header closeButton>
                  <Modal.Title>Reset Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className="mb-4">
                    <p>Please input your email to reset your password.</p>
                    <div className="form-group">
                      <input type="email" className="form-control" placeholder="example@seblak.moe" onChange={this.handleEmail}/>
                    </div>
                  </div>
                  <Alert show={this.state.alertSuccess !== ''} variant="success" onClose={() => this.setState({ alertSuccess: false })}>
                      <Alert.Heading>Success!</Alert.Heading>
                      { this.state.alertSuccess }
                  </Alert>
                  <Alert show={this.state.alertError !== ''} variant="danger" onClose={() => this.setState({ alertError: false })} dismissible>
                      <Alert.Heading>Error!</Alert.Heading>
                      { this.state.alertError }
                  </Alert>
              </Modal.Body>
              <Modal.Footer>
                  {
                      !this.state.alertSuccess &&
                      <>
                          <Button variant="light" onClick={() => this.props.onClose()}>Cancel</Button>
                          <Button variant="primary" onClick={() => this.resetPassword()}>
                            { this.state.loading ? 
                              <Spinner animation='border' as="span" role="status" size="sm" /> :
                              <span>Reset</span>
                            }
                          </Button>
                      </>
                  }
                  {
                      this.state.alertSuccess &&
                      <Button variant="primary" onClick={() => this.props.onClose()}>Close</Button>
                  }
              </Modal.Footer>
          </>
      )
  }
}

export default LoginLayout;