import React from 'react';
import axios from 'axios';

class User extends React.Component {
    state = {
        currentUser: {
            username: '',
            id: 0
        },
        username: '',
        password: '',
        newPassword: '',
        error: ''
    }

    handleUsername = (e) => {
        this.setState({ username: e.target.value });
    }

    handlePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    handleNewPassword = (e) => {
        this.setState({ newPassword: e.target.value });
    }

    updateUsername = async () => {
        const params = {
            username: this.state.currentUser.username,
            password: this.state.password,
            new_username: this.state.username
        }

        try {
            console.log("params => ", params);
            const updateRequest = await axios.post('http://localhost:3000/user/updateUsername', params);
            console.log(updateRequest.data);
            this.setState({ error: '' });
        }
        
        catch(err) {
            console.log(err);
            this.setState({ error: err.response.data.message });
        }
    }

    componentDidMount() {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        this.setState({ currentUser });
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
                <div className="form-group d-flex" style={{ gap: 10 }}>
                    <div style={{ width: 400 }}>
                        <input type="text" className="form-control" name="username" placeholder="New Username" value={this.state.username} onChange={this.handleUsername}/>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.updateUsername()}>Update Username</button>
                </div>
                <div className="form-group d-flex" style={{ gap: 10 }}>
                    <div style={{ width: 195 }}>
                        <input type="password" className="form-control" name="password" placeholder="Old Password" value={this.state.password} onChange={this.handlePassword}/>
                    </div>
                    <div style={{ width: 195 }}>
                        <input type="password" className="form-control" name="new_password" placeholder="New Password" value={this.state.newPassword} onChange={this.handleNewPassword}/>
                    </div>
                    <button className="btn btn-primary">Update Password</button>
                </div>
            </div>
        )
    }
}

export default User;