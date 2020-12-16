import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { AppService } from '../services/app.service';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
    }

    state = {
        token: '',
        password: '',
        passwordRe: '',
        alertError: '',
        alertSuccess: 'Success resetting password!',
        loading: false,
        emailSent: false
    }

    handlePassword = (e) => this.setState({ password: e.target.value });
    handlePasswordRe = (e) => this.setState({ passwordRe: e.target.value });
    resetPassword = async () => {
        if (!this.state.password || !this.state.passwordRe) {
            this.setState({ alertError: 'Please fill password!' });
            return;
        }

        if (this.state.password !== this.state.passwordRe) {
            this.setState({ alertError: 'Password mismatch.' });
            return;
        }

        this.appService.resetPassword(this.state.token, this.state.password).then(
            response => {
                if (response.data.success) {
                    this.setState({
                        alertSuccess: response.data.message,
                        alertError: ''
                    });
                }

                else {
                    this.setState({
                        alertSuccess: '',
                        alertError: response.data.message
                    });
                }
            }
        ).catch(
            error => {
                this.setState({ loading: false });

                let message;
                if (error.response) message = error.response.data.message;
                else message = 'Failed to update password';
                this.setState({ alertSuccess: '', alertError: message });
            }
        )
    }

    async componentDidMount() {
        const token = this.props.match.params.token;
        this.setState({ token });
    }

    render() {
        return(
            <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '100vh' }}>
                {
                    this.state.alertSuccess === '' ?
                    <div className="border border-darken-2 rounded p-4 bg-white" style={{ width: 400 }}>
                        <div className="font-weight-bold text-center text-dark mb-4" style={{ fontSize: '2rem' }}>Reset Password</div>
                        <div>
                            <div className="form-group">
                                <input type="password" className="form-control" name="password" placeholder="New Password" onChange={this.handlePassword}/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" name="passwordRe" placeholder="Confirm New Password" onChange={this.handlePasswordRe}/>
                            </div>
                            <Button variant="primary" block onClick={() => this.resetPassword()}>
                                { this.state.loading ?
                                    <Spinner animation='border' as='span' size="sm"/> :
                                    <span>Submit</span>
                                }
                            </Button>
                            <div className="mt-2 text-right">
                                <Link to="/login" className="text-primary">Back to login</Link>
                            </div>
                            <div className="mt-4">
                                <Alert show={this.state.alertError !== ''} variant="danger" onClose={() => this.setState({ alertError: '' })} dismissible>
                                    <Alert.Heading>Error!</Alert.Heading>
                                    { this.state.alertError }
                                </Alert>
                            </div>
                        </div>
                    </div> :

                    <div className="text-center">
                        <div className="text-dark" style={{ fontSize: '2rem' }}>
                            { this.state.alertSuccess }
                        </div>
                        <Link to="/login" className="text-primary">Back to login page</Link>
                    </div>
                }
            </div>
        )
    }
}

export default ResetPassword;