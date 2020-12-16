import React from 'react';
import Sidebar from '../components/Sidebar';
import { AppService } from '../services/app.service';
import PasswordIllust from '../assets/images/password.svg';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
    }

    state = {
        password: '',
        passwordRe: '',

        // alerts
        alertSuccess: '',
        alertError: '',
    }

    handlePassword = e => this.setState({ password: e.target.value });
    handlePasswordRe = e => this.setState({ passwordRe: e.target.value });

    changePassword() {
        if (!this.state.password || !this.state.passwordRe) return;

        if (this.state.password !== this.state.passwordRe) return;

        this.appService.changePassword(this.state.password).then(
            response => {
                this.setState({
                    alertSuccess: "Update password success!",
                    alertError: ""
                });
            }
        ).catch(
            error => {
                console.error(error);

                let message;
                if (error.response) message = error.response.message;
                else message = 'Failed updating password.';
                this.setState({
                    alertSuccess: '',
                    alertError: message
                })
            }
        )
    }

    render() {
        return (
            <>
                <div className="font-weight-bold text-dark border-bottom pb-3" style={{ fontSize: '2rem' }}>
                    Change Password
                </div>
                <div className="d-flex justify-content-center" style={{ gap: 100, marginTop: 50 }}>
                    <div>
                        <div className="mb-3">
                            <label for="password">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New password"
                                style={{ width: 300 }}
                                onChange={this.handlePassword}
                            />
                        </div>
                        <div className="mb-3">
                            <label for="password">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                                style={{ width: 300 }}
                                onChange={this.handlePasswordRe}
                            />
                        </div>
                        <div>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                    <img src={PasswordIllust} style={{ width: 400 }}/>
                </div>
                <Sidebar/>
            </>
        )
    }
}

export default ChangePassword;