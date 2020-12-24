import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { AppService } from '../services/app.service';
import { Notyf } from 'notyf';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
    }

    state = {

        // params
        token: '',
        password: '',
        passwordRe: '',

        // state
        loading: false,
        emailSent: false
    }

    handlePassword = (e) => this.setState({ password: e.target.value });
    handlePasswordRe = (e) => this.setState({ passwordRe: e.target.value });
    resetPassword = async () => {
        if (!this.state.password || !this.state.passwordRe) {
            this.notyf.error("Please fill all required field!");
            return;
        }

        if (this.state.password !== this.state.passwordRe) {
            this.notyf.error("Password missmatch!");
            return;
        }

        this.setState({ loading: true });
        this.appService.resetPassword(this.state.token, this.state.password).then(
            response => {
                if (response.data.success) {
                    this.setState({ loading: false });
                    this.notyf.success(response.data.message);
                    window.location.href = '/login';
                }
                
                else throw(response.data.message);
            }
        ).catch(
            error => {
                this.setState({ loading: false });
                if (typeof error == 'string') this.notyf.error(error);
                else this.notyf.error('Failed to update password');
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
                <div className="border border-darken-2 rounded p-4 bg-white" style={{ width: 400 }}>
                    <div className="font-weight-bold text-center text-dark mb-4" style={{ fontSize: '2rem' }}>Reset Password</div>
                    <form id="formResetPassword" onSubmit={e => e.preventDefault()}>
                        <div className="form-group">
                            <input type="password" className="form-control" name="password" placeholder="New Password" onChange={this.handlePassword}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" name="passwordRe" placeholder="Confirm New Password" onChange={this.handlePasswordRe}/>
                        </div>
                        <Button variant="primary" type="submit" disabled={this.state.loading} block onClick={() => this.resetPassword()}>
                            { this.state.loading ?
                                <Spinner animation='border' as='span' size="sm"/> :
                                <span>Submit</span>
                            }
                        </Button>
                        <div className="mt-2 text-right">
                            <Link to="/login" className="text-primary">Back to login</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default ResetPassword;