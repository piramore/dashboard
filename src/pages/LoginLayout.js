import React from 'react';
import { Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { AppService } from '../services/app.service';

class LoginLayout extends React.Component {
  constructor(props) {
    super(props);
    this.appService = new AppService();
    this.notyf = new Notyf();
  }

  state = {
    username: '',
    email: '',
    password: '',
    error: '',
    loginSuccess: false,
    resetPasswordModal: false,
    loginLoading: false
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  login = async () => {
    const { email, password } = this.state;
    
    this.setState({ loginLoading: true });
    this.appService.login(email, password).then(
      response => {
        this.setState({ loginLoading: false });

        if (!response.data.admin || !response.data.token) {
          console.log("throwing error");
          throw(response.data.message);
        }

        else {
          let loggedUser = response.data.admin;
          localStorage.setItem('user', JSON.stringify(loggedUser));
          localStorage.setItem('token', response.data.token);
          window.location.href = '/';
        }
      }
    ).catch(err => {
      this.setState({ loginLoading: false });
      let message;

      if (typeof err == 'string') {
        console.error(err);
        message = err;
      }

      else {
        console.error(err);
        message = "Failed to login";
      }

      this.notyf.error(message);
    })

    // this is old ways
    // try {
    //   let loginRequest = await axios.post(`http://${SERVICE_HOST}/login`, { email, password }, );

    //   if (loginRequest.data.success == "false") throw loginRequest.data.message;

    //   let loggedUser = loginRequest.data.admin;

    //   localStorage.setItem("user", JSON.stringify(loggedUser));
    //   localStorage.setItem("token", loginRequest.data.token);
    //   window.location.href = "/";
    // }
    // catch(err) {
    //   if (err.response) this.setState({ error: err.response.data.message });
    //   else if (typeof err == 'string') this.setState({ error: err });
    //   else this.setState({ error: 'Cannot conenct to server' });
    // }
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
        <div className="card" style={{ width: 400 }}>
          <div className="card-body">
            <div className="font-weight-bold mb-4 text-center" style={{ fontSize: '2rem' }}>Login</div>
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  autoFocus={true}
                />
              </div>
              <div className="form-group">
                <input className="form-control" type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
              </div>
              <button className="btn btn-block btn-primary" type="submit" onClick={() => this.login()}>
                { this.state.loginLoading ? 
                  <Spinner animation='border' as="span" role="status" size="sm" /> : 
                  'Login'
                }
              </button>
            </form>
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
    this.appService = new AppService();
    this.notyf = new Notyf();
  }

  state = {

    // alert message
    alertError: '',

    // params
    email: '',

    // state
    loading: false,
    emailSent: false,
    mailSentMessage: '',
  }

  handleEmail = (e) => this.setState({ email: e.target.value });
  
  sentMail = () => {
    this.setState({ loading: true });
    this.appService.forgotPassword(this.state.email).then(
      response => {
        if (response.data.success) {
          this.notyf.success(response.data.message);
          this.props.onClose();
        }

        else throw(response.data.message);
      }
    ).catch(
      error => {
        if (typeof error === 'string') {
          console.error(error);
          this.setState({
            loading: false,
            alertError: error
          });
        }

        else {
          console.error(error);
          this.setState({
            loading: false,
            alertError: "Failed to request reset password token."
          });
        }
      }
    );

    // old ways
    // const params = {
    //   email: this.state.email
    // }
    // 
    // try {
    //   this.setState({ loading: true });
    //   const updateReq = await axios.post(`http://${SERVICE_HOST}/forgotpassword`, params);
    //   this.setState({ loading: false });
    //   if (updateReq.data.success) {
    //     this.setState({
    //       alertError: "",
    //       alertSuccess: updateReq.data.message,
    //       // emailSent: true
    //     });
    //   } else {
    //     this.setState({ alertSuccess: '', alertError: updateReq.data.message });
    //   }
    // }

    // catch(err) {
    //   this.setState({ loading: false });
    //   let message;
    //   if (err.response) message = err.response.data.message;
    //   this.setState({
    //       alertError: message || "Failed requesting password reset!",
    //       alertSuccess: ''
    //   });
    //   console.log(err);
    // }
  }

  render() {
      return (
          <>
              <Modal.Header closeButton>
                  <Modal.Title>Reset Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form id="resetPasswordForm" className="mb-4" onSubmit={e => e.preventDefault()}>
                  <p>Please input your email to reset your password.</p>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      key="email"
                      placeholder="example@seblak.moe"
                      autoFocus={true}
                      onChange={this.handleEmail}
                    />
                  </div>
                </form>
                <Alert show={this.state.alertError !== ''} variant="danger" onClose={() => this.setState({ alertError: '' })} dismissible>
                    <Alert.Heading>Error!</Alert.Heading>
                    { this.state.alertError }
                </Alert>
              </Modal.Body>
              <Modal.Footer style={{ justifyContent: 'space-between' }}>
                <div>
                  {/* { false &&
                    <span className="text-primary" style={{ cursor: 'pointer' }}
                      onClick={() => this.setState({ emailSent: true })}>
                      Already have token?
                    </span>
                  } */}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="light" onClick={() => this.props.onClose()}>Cancel</Button>
                  <Button
                    form="resetPasswordForm"
                    type="submit"
                    variant="primary"
                    disabled={this.loading}
                    onClick={() => this.sentMail()}>
                    { this.state.loading ? 
                      <Spinner animation='border' as="span" role="status" size="sm" /> :
                      <span>Submit</span>
                    }
                  </Button>
                </div>
              </Modal.Footer>
          </>
      )
  }
}

export default LoginLayout;