import React from 'react';
import axios from 'axios';
import { Alert, Button, Spinner } from 'react-bootstrap';

import { SERVICE_HOST } from '../configs/Host.config';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        token: '',
        password: '',
        passwordRe: '',
        alertError: '',
        alertSuccess: '',
        loading: false,
        emailSent: false
    }

    handlePassword = (e) => this.setState({ password: e.target.value });
    handlePasswordRe = (e) => this.setState({ passwordRe: e.target.value });
    resetPassword = async () => {
        if (this.state.password !== this.state.passwordRe) {
            this.setState({ alertError: 'Password mismatch.' });
            return;
        }
        
        const token = this.state.token;
        const params = {
            newPassword: this.state.password
        }

        try {
            this.setState({ loading: true });
            const response = await axios.post(`/api/resetpassword/${token}`, params);
            this.setState({ loading: false });

            if (response.data.success) {
                this.setState({
                    alertSuccess: response.data.message,
                    alertError: ''
                });
            } else {
                this.setState({
                    alertSuccess: '',
                    alertError: response.data.message
                });
            }
        }

        catch(err) {
            this.setState({ loading: false });
            let message;
            if (err.response) message = err.response.data.message;
            this.setState({
                alertError: message || 'Failed to update password',
                alertSuccess: ''
            });
        }
    }

    async componentDidMount() {
        const token = this.props.match.params.token;
        this.setState({ token });
    }

    render() {
        return(
            <div className="container">
                <h1>Reset Password</h1>
                <div style={{ width: 500, margin: "50px auto 0px auto" }}>
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
                    <div className="mt-4">
                        <Alert show={this.state.alertError !== ''} variant="danger" onClose={() => this.setState({ alertError: '' })} dismissible>
                            <Alert.Heading>Error!</Alert.Heading>
                            { this.state.alertError }
                        </Alert>
                        <Alert show={this.state.alertSuccess !== ''} variant="success" onClose={() => this.setState({ alertSuccess: '' })} dismissible>
                            <Alert.Heading>Success!</Alert.Heading>
                            <p>{ this.state.alertError }</p>
                            <a href="/">Back to home</a>
                        </Alert>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetPassword;