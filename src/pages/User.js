import React from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';

import { SERVICE_HOST } from '../configs/Host.config';

class User extends React.Component {
    state = {
        currentUser: {
            username: '',
            id: 0
        },
        error: '',
        modalUsername: false,
        modalPassword: false
    }

    loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        this.setState({ currentUser });
    }

    componentDidMount() {
        this.loadUserData();
    }

    render() {
        return (
            <div>
                <h1>User Settings</h1>
                { this.state.error && <div className="alert alert-danger">{ this.state.error }</div> }
                <div className="card mb-4">
                    <div className="card-header font-weight-bold">Current User</div>
                    <div className="card-body">
                        <pre>
                            { JSON.stringify({ ...this.state.currentUser, password: '*****' }, null, 2) }
                        </pre>
                    </div>
                </div>
                <Button
                    variant="primary"
                    onClick={() => this.setState({ modalUsername: true })}
                    className="mr-2">
                    <i className="fa fa-user mr-1"></i>
                    Change Username
                </Button>
                <Button
                    variant="primary"
                    onClick={() => this.setState({ modalPassword: true })}>
                    <i className="fa fa-key mr-1"></i>
                    Change Password
                </Button>
                <Modal show={this.state.modalUsername} onHide={() => this.setState({ modalUsername: false })}>
                    <ModalChangeUsername
                        onClose={() => this.setState({ modalUsername: false })}
                        onUpdate={() => this.loadUserData()}>
                    </ModalChangeUsername>
                </Modal>
                <Modal show={this.state.modalPassword} onHide={() => this.setState({ modalPassword: false })}>
                    <ModalChangePassword
                        onClose={() => this.setState({ modalPassword: false })}>
                    </ModalChangePassword>
                </Modal>
            </div>
        )
    }
}

class ModalChangeUsername extends React.Component {
    constructor(props) {
        super(props);
    }
    
    state = {
        username: '',
        password: '',
        alertSuccess: false,
        alertError: false
    }

    handleUsername = (e) => this.setState({ username: e.target.value });
    handlePassword = (e) => this.setState({ password: e.target.value });
    changeUsername = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const params = {
            username: currentUser.username,
            password: this.state.password,
            new_username: this.state.username
        }

        try {
            const updateRequest = await axios.post(`http://${SERVICE_HOST}/user/updateUsername`, params);
            localStorage.setItem('user', JSON.stringify(updateRequest.data.data));
            this.setState({ alertSuccess: true, alertError: false });
            this.props.onUpdate();
        }
        catch(err) {
            this.setState({ alertError: true, alertSuccess: false });
            console.log(err);
        }
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Change Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="username">New Username</label>
                        <input className="form-control" name="username" placeholder="New Username" autoComplete="off" onChange={this.handleUsername}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" type="password" name="password" placeholder="Password" onChange={this.handlePassword}/>
                    </div>
                    <Alert show={this.state.alertSuccess} variant="success" onClose={() => this.setState({ alertSuccess: false })} dismissible>
                        <Alert.Heading>Success!</Alert.Heading>
                        Success updating username!
                    </Alert>
                    <Alert show={this.state.alertError} variant="danger" onClose={() => this.setState({ alertError: false })} dismissible>
                        <Alert.Heading>Error!</Alert.Heading>
                        Failed updating username!
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.changeUsername()}>Save</Button>
                </Modal.Footer>
            </>
        )
    }
}

class ModalChangePassword extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
        alertSuccess: false,
        alertError: ''
    }

    handlePassword = (e) => this.setState({ password: e.target.value });
    handleNewPassword = (e) => this.setState({ newPassword: e.target.value });
    handleNewPasswordConfirm = (e) => this.setState({ newPasswordConfirm: e.target.value });
    
    changePassword = async () => {
        if (this.state.newPassword != this.state.newPasswordConfirm) {
            this.setState({ alertError: 'New password mismatch!' });
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const params = {
            username: currentUser.username,
            password: this.state.password,
            new_password: this.state.newPassword,
        }

        try {
            const updateRequests = await axios.post(`http://${SERVICE_HOST}/user/updatePassword`, params);
            this.setState({ alertSuccess: true, alertError: "" });
        }
        catch(err) {
            this.setState({ alertError: "Failed updating password!", alertSuccess: false });
            console.log(err);
        }
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="password">Current Password</label>
                        <input type="password" className="form-control" name="password" placeholder="Current Password" onChange={this.handlePassword}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <input type="password" className="form-control" name="new-password" placeholder="New Password" onChange={this.handleNewPassword}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password-confirm">Confirm New Password</label>
                        <input type="password" className="form-control" name="new-password-confirm" placeholder="Confirm New Password" onChange={this.handleNewPasswordConfirm}/>
                    </div>
                    <Alert show={this.state.alertSuccess} variant="success" onClose={() => this.setState({ alertSuccess: false })} dismissible>
                        <Alert.Heading>Success!</Alert.Heading>
                        Success updating password!
                    </Alert>
                    <Alert show={this.state.alertError != ''} variant="danger" onClose={() => this.setState({ alertError: false })} dismissible>
                        <Alert.Heading>Error!</Alert.Heading>
                        { this.state.alertError }
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => this.props.onClose()}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.changePassword()}>Save</Button>
                </Modal.Footer>
            </>
        )
    }
}

export default User;