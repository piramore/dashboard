import React from 'react';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { Spinner, Modal, Button } from 'react-bootstrap';

import { AppService } from '../../services/app.service';
import Avatar from '../../assets/images/avatar.png';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
    }

    state = {
        userList: [],

        // add edit user
        addUserMode: 'add',
        editedUser: undefined,
        
        // modal
        modalAddUser: false,

        // loading
        loadingGetUser: false,
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        this.setState({ loadingGetUser: true });
        this.appService.getAdmin().then(
            response => {
                this.setState({ loadingGetUser: false });
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
            }
        ).catch(
            error => {
                this.setState({ loadingGetUser: false });
                if (typeof error === 'string') {
                    console.error(error);
                    this.setState({ errorMessage: error });
                }

                else {
                    console.error(error);
                    this.setState({ errorMessage: "Failed to get admin list" });
                }
            }
        )
    }

    deleteUser(id) {
        if (!id) return;

        if (window.confirm('Are you sure want to delete this admin?')) {
            this.appService.deleteAdmin(id, 'superAdmin')
                .then (response => {
                    if (response.data.success) {
                        this.notyf.success('Success deleting admin!');
                        this.getUser();
                    }
                    else {
                        throw(response.data.message);
                    }
                })
                .catch(err => {
                    if (typeof err == 'string') this.notyf.error(err);
                    else this.notyf.error('Failed to delete admin');
                })
        }
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

    render() {
        return (
            <>
                <div className="d-flex justify-content-end align-items-center mb-4" style={{ gap: '20px' }}>
                    <button className="btn btn-outline-primary" onClick={() => this.openAddUserModal('add')}>
                        <i className="fa fa-plus mr-2"></i>
                        Add User
                    </button>
                    <div>
                        <Link to='/home'>
                            <i className="fa fa-times text-danger"></i>
                        </Link>
                    </div>
                </div>
                <div className="mt-2 px-2 d-flex">
                    <div className="py-2 font-weight-bold" style={{ width: '50%' }}>User Detail</div>
                    <div className="py-2 font-weight-bold" style={{ width: 'calc(50% - 200px)' }}>Roles</div>
                    <div className="py-2 font-weight-bold" style={{ width: '200px' }}>Actions</div>
                </div>
                <div className="user-list">
                    {
                        this.state.loadingGetUser &&
                        <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                            <Spinner animation='border' role="status" size="lg" />
                        </div>
                    }
                    {
                        this.state.userList.map(user => (
                            <div className="user-list-item">
                                <div className="d-flex align-items-center" style={{ gap: '20px', width: '50%' }}>
                                    <img src={Avatar} className="rounded-circle" style={{ height: '60px' }}></img>
                                    <div>
                                        <div className="font-weight-bold">{user.name}</div>
                                        <div>{user.email}</div>
                                    </div>
                                </div>
                                <div style={{ width: 'calc(50% - 200px)' }}>{user.role}</div>
                                <div className="d-flex" style={{ width: '200px', gap: '10px' }}>
                                    {/* <div className="text-primary font-weight-bold"
                                        style={{ cursor: 'pointer' }}>
                                        <i className="fa fa-pencil-alt mr-1"></i>
                                        Edit
                                    </div>
                                    <div className="text-danger font-weight-bold"
                                        style={{ cursor: 'pointer' }}>
                                        <i className="fa fa-trash mr-1"></i>
                                        Delete
                                    </div> */}
                                    <button className="btn btn-primary" onClick={() => this.openAddUserModal('edit', user)}>
                                        <i className="fa fa-pencil-alt mr-2"></i>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger" onClick={() => this.deleteUser(user._id)}>
                                        <i className="fa fa-trash mr-2"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Modal Here */}
                <Modal show={this.state.modalAddUser} onHide={() => this.setState({ modalAddUser: false })}>
                    <ModalAddUser
                        onClose={() => this.setState({ modalAddUser: false })}
                        onReload={() => this.getUser()}
                        mode={this.state.addUserMode}
                        editedUser={this.state.editedUser}>
                    </ModalAddUser>
                </Modal>
            </>
        )
    }
}


class ModalAddUser extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
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

    addUser() {
        if (!this.state.name || !this.state.email || !this.state.password) {
            alert("Please fill all field");
        }

        this.appService.createAdmin(
            this.state.name,
            this.state.email,
            this.state.password
        ).then(
            response => {
                if (response.data.success === false) throw(response.data.message);
                else {
                    this.notyf.success("Adding admin success!");
                    this.props.onReload();
                    this.props.onClose();
                }
            }
        ).catch(
            error => {
                console.error(error);
                if (typeof error === 'string') this.notyf.error(error);
                else this.notyf.error("Failed adding admin!");
            }
        )
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    { this.state.mode == 'add' ? 'Add User' : undefined }
                    { this.state.mode == 'edit' ? 'Edit User' : undefined }
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <img className="rounded-circle" src={Avatar} style={{ height: 150, margin: "20px 0px" }}/>
                    </div>
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
                    {/* <div className="form-group">
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
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.addUser()}>Submit</Button>
                </Modal.Footer>
            </>
        )
    }
}

export default Users;