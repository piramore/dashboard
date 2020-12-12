import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

import { SERVICE_HOST } from '../configs/Host.config';

class Admin extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        userList: [1,2,3,4],
        modalAddUser: false,
        addUserMode: 'add',
        editedUser: {},
        errorMessage: '',
    };

    componentDidMount() {
        this.getUser();
    }

    openAddUserModal(mode, editedUser) {
        if (mode !== 'add' && mode !== 'edit') return;
        this.setState({
            addUserMode: mode,
            editedUser: editedUser ? {
                name: editedUser.name,
                email: editedUser.email,
                password: '',
                role: editedUser.role
            } : undefined
        });
        this.setState({ modalAddUser: true })
    }

    async getUser() {
        const token = localStorage.getItem("token");
        const headers = { 'Authorization': `Bearer ${token}` }

        try {
            let response = await axios.get(`http://${SERVICE_HOST}/admin/list`, { headers });

            let userList = [];
            for (let [id, data] of Object.entries(response.data)) {
                userList.push({
                    email: data.email,
                    name: data.name,
                    role: data.role ? data.role.map(role => role.name)[0] : '',
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    salt: data.salt,
                });
            }
            this.setState({ userList });
            console.log(this.state.userList);
        }

        catch(err) {
            this.setState({ errorMessage: err });
        }
    }

    render() {
        return (
            <div>
                <h1>Admin Page</h1>
                <div className="d-flex justify-content-between align-items-center my-4">
                    <div className="font-weight-bold" style={{ fontSize: '1.5rem' }}>
                        User List
                    </div>
                    <div>
                        <Button variant="primary" onClick={() => this.openAddUserModal('add', undefined)}>Add User</Button>
                    </div>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th style={{ width: '200px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.userList.map(user => (
                            <tr key={user._id}>
                                <td>{ user.name || (<i>No name</i>) }</td>
                                <td>{ user.role?.length ? user.role : (<i>No roles</i>) }</td>
                                <td>{ user.email || (<i>No email</i>) }</td>
                                <td className="d-flex" style={{ gap: '10px' }}>
                                    <Button size="sm" variant="danger">Delete</Button>
                                    <Button size="sm" variant="primary" onClick={() => this.openAddUserModal('edit', user)}>Edit</Button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </Table>

                {/* Modal Here */}
                <Modal show={this.state.modalAddUser} onHide={() => this.setState({ modalAddUser: false })}>
                    <ModalAddUser
                        onClose={() => this.setState({ modalAddUser: false })}
                        mode={this.state.addUserMode}
                        editedUser={this.state.editedUser}>
                    </ModalAddUser>
                </Modal>
            </div>
        )
    }
}

class ModalAddUser extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        mode: this.props.mode,
        name: '',
        email: '',
        password: '',
        role: 'superAdmin',
    }

    componentWillMount() {
        if (this.props.mode === 'edit') {
            this.setState({ ...this.props.editedUser });
        }

        else if (this.props.mode === 'add') {
            this.setState({ name: '', email: '', password: '' });
        }
    }

    handleName = e => this.setState({ name: e.target.value });
    handleEmail = e => this.setState({ email: e.target.value });
    handlePassword = e => this.setState({ password: e.target.value });
    handleRole = e => this.setState({ role: e.target.value });

    async addUser() {
        if (!this.state.name || !this.state.email || !this.state.password || !this.state.role) {
            alert("Please fill all field");
        }

        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };
        const params = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role
        }

        try {
            let response = await axios.post(`http://${SERVICE_HOST}/admin/create`, params, { headers });
            alert("Adding user success!");
        }

        catch(err) {
            console.error(err);
            alert("Failed adding user.");
        }
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>Add User</Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            autoComplete="off"
                            onChange={this.handleName}
                            value={this.state.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="off"
                            onChange={this.handleEmail}
                            value={this.state.email}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={this.handlePassword}
                            value={this.state.password}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            className="form-control"
                            name="role"
                            id="role"
                            placeholder="Role"
                            onChange={this.handleRole}
                            value={this.state.role}>
                            <option value="superAdmin">Superadmin</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.addUser()}>Submit</Button>
                </Modal.Footer>
            </>
        )
    }
}

export default Admin;