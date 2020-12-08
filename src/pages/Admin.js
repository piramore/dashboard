import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

class Admin extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        userList: [1,2,3,4],
        modalAddUser: false
    };

    render() {
        return (
            <div>
                <h1>Admin Page</h1>
                <div className="d-flex justify-content-between align-items-center my-4">
                    <div class="font-weight-bold" style={{ fontSize: '1.5rem' }}>
                        User List
                    </div>
                    <div>
                        <Button variant="primary" onClick={() => this.setState({ modalAddUser: true })}>Add User</Button>
                    </div>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th style={{ width: '200px' }}>Action</th>
                    </thead>
                    <tbody>
                        { this.state.userList.map(user => (
                            <tr>
                                <td>Agus</td>
                                <td>agus_tampan</td>
                                <td>agus_tampan@gmail.com</td>
                                <td className="d-flex" style={{ gap: '10px' }}>
                                    <Button size="sm" variant="danger">Delete</Button>
                                    <Button size="sm" variant="primary">Edit</Button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </Table>

                {/* Modal Here */}
                <Modal show={this.state.modalAddUser} onHide={() => this.setState({ modalAddUser: false })}>
                    <ModalAddUser
                        onClose={() => this.setState({ modalAddUser: false })}>
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
        username: '',
        name: '',
        email: '',
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
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            className="form-control"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            autoComplete="off"
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
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select className="form-control" name="role" id="role" placeholder="Role">
                            <option value="superadmin">Superadmin</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onClose}>Cancel</Button>
                    <Button variant="primary">Submit</Button>
                </Modal.Footer>
            </>
        )
    }
}

export default Admin;