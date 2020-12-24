import React from 'react';
import Sidebar from '../components/Sidebar';
import { AppService } from '../services/app.service';
import PasswordIllust from '../assets/images/password.svg';
import { Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
    }

    state = {
        password: '',
        passwordRe: '',

        // loading
        changePasswordLoading: false,
    }

    handlePassword = e => this.setState({ password: e.target.value });
    handlePasswordRe = e => this.setState({ passwordRe: e.target.value });

    changePassword() {
        if (!this.state.password || !this.state.passwordRe) {
            this.notyf.error('Please fill all required field.');
            return;
        }

        if (this.state.password !== this.state.passwordRe) {
            this.notyf.error('Password missmatch.');
            return;
        }

        this.setState({ changePasswordLoading: true });
        this.appService.changePassword(this.state.password).then(
            response => {
                this.notyf("Update password success!");
                this.setState({ changePasswordLoading: false });
            }
        ).catch(
            error => {
                let message;
                if (error.response) message = error.response.message;
                else message = 'Failed updating password.';

                console.error(error);
                this.setState({ changePasswordLoading: false });
                this.notyf.error(message);
            }
        )
    }

    render() {
        return (
            <>
                <div className="font-weight-bold text-dark mt-3" style={{ fontSize: '2rem' }}>
                    Change Password
                </div>
                <div className="d-flex justify-content-center" style={{ gap: 100, marginTop: 50 }}>
                    <div>
                        <div className="mb-3">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New password"
                                style={{ width: 300 }}
                                onChange={this.handlePassword}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                                style={{ width: 300 }}
                                onChange={this.handlePasswordRe}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-primary"
                                disabled={this.state.changePasswordLoading}
                                onClick={() => this.changePassword()}>
                                {
                                    this.state.changePasswordLoading ?
                                    <Spinner animation='border' as="span" role="status" size="sm" /> :
                                    "Submit"
                                }
                            </button>
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