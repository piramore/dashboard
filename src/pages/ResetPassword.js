import React from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';

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
        tokenInvalid: false
    }

    handlePassword = (e) => this.setState({ password: e.target.value });
    handlePasswordRe = (e) => this.setState({ passwordRe: e.target.value });
    changePassword = async () => {
        if (this.state.password !== this.state.passwordRe) {
            this.setState({ alertError: 'Password mismatch.' });
            return;
        }
        
        const params = {
            password: this.state.password,
            token: this.state.token
        }

        try {
            const updateRequest = await axios.post(`http://${SERVICE_HOST}/user/reset_password`, params);
            this.setState({
                alertSuccess: updateRequest.data.message,
                alertError: ''
            });
        }

        catch(err) {
            console.log(err.response);
            this.setState({
                alertError: err.response ? err.response.data.message : 'Failed to update password',
                alertSuccess: ''
            });
        }
    }

    async componentDidMount() {
        const token = this.props.match.params.token;
        try {
            await axios.post(`http://${SERVICE_HOST}/user/check_token`, { token });
            this.setState({ token });
        }

        catch(err) {
            this.setState({ tokenInvalid: true });
        }
    }

    render() {
        return(
            <div className="container">
                <h1>Reset Password</h1>
                <div style={{ width: 500, margin: "50px auto 0px auto" }}>
                    <Alert show={this.state.tokenInvalid} variant="danger">
                        <Alert.Heading>Error!</Alert.Heading>
                        Token is invalid or expired!
                    </Alert>
                    {
                        !this.state.tokenInvalid &&
                        <>
                            <div className="form-group">
                                <input type="password" className="form-control" name="password" placeholder="New Password" onChange={this.handlePassword}/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" name="passwordRe" placeholder="Confirm New Password" onChange={this.handlePasswordRe}/>
                            </div>
                            <Button variant="primary" block onClick={() => this.changePassword()}>
                                Submit
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
                        </>
                    }
                </div>
            </div>
        )
    }
}

export default ResetPassword;