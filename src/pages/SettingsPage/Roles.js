import React from 'react';
import { Notyf } from 'notyf';
import { Spinner, Modal, Button, Table } from 'react-bootstrap';

import { AppService } from '../../services/AppService';
import Shield from '../../assets/images/role.png';

class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
    }

    state = {
        rolesData: [],
        rolesLoading: false,

        // modal
        modalCreateRole: false,
    }

    componentDidMount() {
        this.getRoles();
    }

    getRoles() {
        this.setState({ rolesLoading: true });
        this.appService.getRole().then(
            response => {
                
                this.setState({ rolesLoading: false });
                if (response.data) {
                    let rolesData = [];
                    for (let key of Object.keys(response.data)) {
                        let roles = response.data[key];
                        rolesData.push(roles);
                    }
                    this.setState({ rolesData });
                }
                
                else throw(response.data.message);
            }
        ).catch(
            error => {
                this.setState({ rolesLoading: false });
                console.error(error);
                if (typeof error == 'string') this.notyf.error(error);
                else this.notyf.error("Failed getting roles data");
                this.setState({ rolesData: [] });
            }
        )
    }

    openModal() {
        this.setState({ modalCreateRole: true });
    }

    render() {
        return (
            <>

                {/* add roles row */}
                <div className="d-flex justify-content-end align-items-center mb-4" style={{ gap: 20 }}>
                    <button className="btn btn-outline-primary" onClick={() => this.openModal()}>
                        <i className="fa fa-plus mr-2"></i>
                        Add Roles
                    </button>
                </div>

                {/* table head row */}
                <div className="mt-2 px-2 d-flex">
                    <div className="py-2 font-weight-bold" style={{ width: '40%' }}>Name</div>
                    <div className="py-2 font-weight-bold" style={{ width: 'calc(60% - 200px)' }}>Module</div>
                    <div className="py-2 font-weight-bold" style={{ width: '200px' }}>Actions</div>
                </div>

                {/* table data row */}
                <div className="role-list">
                    {
                        this.state.rolesLoading ?

                        // loading indicator
                        <div className="d-flex align-items-center justify-content-center" style={{ height: 400 }}>
                            <Spinner animation="border" role="status" size="lg" />
                        </div> :

                        // roles list
                        this.state.rolesData.map(role => (
                            <div className="role-list-item" key={ role.name }>
                                <div style={{ width: '40%' }}>
                                    <div className="d-flex align-items-center" style={{ gap: '20px' }}>
                                        <img src={Shield} className="rounded-circle" style={{ height: 60 }} />
                                        <div>
                                            <div className="font-weight-bold">{ role.name }</div>
                                            <div>{ role.desc }</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: 'calc(60% - 200px)' }}>
                                    {
                                        role.module.map(module => (
                                            <div key={module.name}>
                                                { module.name } (Lv. { module.levelAccess })
                                            </div>
                                        ))
                                    }
                                </div>
                                <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
                                    <button className="btn btn-primary">
                                        <i className="fa fa-pencil-alt mr-2"></i>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger">
                                        <i className="fa fa-trash mr-2"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Modal Here */}
                <Modal
                    show={this.state.modalCreateRole}
                    onHide={() => this.setState({ modalCreateRole: false })}
                    size="lg">
                    <ModalAddRole
                        onClose={() => this.setState({ modalCreateRole: false })}
                        onReload={() => this.getRoles()}>
                    </ModalAddRole>
                </Modal>
            </>
        )
    }
}

class ModalAddRole extends React.Component {
    constructor(props) {
        super(props);
        this.appService = new AppService();
        this.notyf = new Notyf();
    }

    state = {

        // params
        name: '',
        desc: '',
        module: {},
        levelAccess: 0,

        // data
        moduleList: [],

        // state
        loading: false,
    }

    componentDidMount() {
        this.loadModule();
    }

    handleName = e => this.setState({ name: e.target.value });
    handleDesc = e => this.setState({ desc: e.target.value });
    handleLevelAccess = e => this.setState({ levelAccess: e.target.value });

    handleModule = (event, mod, type) => {
        let currentModule = this.state.module;
        if (type === "full_access") {
            if (event.target.checked) {
                currentModule[mod] = {
                    full_access: true,
                    view: true,
                    create: true,
                    edit: true,
                    delete: true
                }
            }

            else {
                currentModule[mod] = {
                    full_access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false
                }
            }
        }

        else if (type === "view") {
            currentModule[mod] = {
                full_access: false,
                view: true,
                create: false,
                edit: false,
                delete: false
            }
        }

        else if (type === "create") {
            currentModule[mod] = {
                full_access: false,
                view: true,
                create: true,
                edit: false,
                delete: false
            }
        }

        else if (type === "edit") {
            currentModule[mod] = {
                full_access: false,
                view: true,
                create: true,
                edit: true,
                delete: false
            }
        }

        else if (type === "delete") {
            currentModule[mod] = {
                full_access: true,
                view: true,
                create: true,
                edit: true,
                delete: true
            }
        }

        this.setState({ module: currentModule });
    }

    loadModule() {
        let moduleList = ["users", "roles"];

        let mods = {};
        for (let mod of moduleList) {
            mods[mod] = {
                full_access: false,
                view: false,
                create: false,
                edit: false,
                delete: false
            }
        }
        this.setState({ moduleList, module: mods });

        setTimeout(() => console.log(this.state), 500);
    }

    createRole() {

        // kalau ada field yang kosong, alert error;
        if (!this.state.name || !this.state.desc || !this.state.module || !this.state.levelAccess) {
            this.notyf.error("Please fill all required field!");
            return;
        }

        this.setState({ loading: true });
        this.appService.createRole(
            this.state.name,
            this.state.desc,
            this.state.module,
            this.state.levelAccess
        ).then(
            response => {
                this.setState({ loading: false });
                console.log('create role response => ', response);
            }
        ).catch(
            error => {
                this.setState({ loading: false });
                if (typeof error == 'string') this.notyf.error(error);
                else this.notyf.error("Failed creating new roles.");
            }
        )
    }

    printRole() {
        console.log(this.state);
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    Add Role
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <img className="rounded-circle" src={Shield} style={{ height: 150, margin: "20px 0px" }}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            id="name"
                            name="name"
                            key="name"
                            placeholder="Name"
                            autoComplete="off"
                            onChange={this.handleName}
                            value={this.state.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea
                            className="form-control"
                            id="desc"
                            name="desc"
                            key="desc"
                            placeholder="Description"
                            rows={4}
                            onChange={this.handleDesc}
                            value={this.state.desc}
                            style={{ resize: 'none' }}
                        ></textarea>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="module">Module</label>
                        <input
                            className="form-control"
                            type="text"
                            id="module"
                            name="module"
                            placeholder="Module"
                            autoComplete="off"
                            onChange={this.handleModule}
                            value={this.state.module}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="levelAccess">Level Access</label>
                        <input
                            className="form-control"
                            type="number"
                            id="levelAccess"
                            name="levelAccess"
                            placeholder="Level Access"
                            autoComplete="off"
                            onChange={this.handleLevelAccess}
                            value={this.state.levelAccess}
                        />
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="module">Module</label>
                        <Table striped bordered className="text-center">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Full Access</th>
                                    <th>View</th>
                                    <th>Create</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.moduleList.map(mod => (
                                        <tr key={mod}>
                                            <td>{mod}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="full_access"
                                                    name="full_access"
                                                    onChange={($event) => this.handleModule($event, mod, 'full_access')}
                                                    checked={this.state.module[mod] ? this.state.module[mod].full_access : undefined}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="view"
                                                    name="view"
                                                    onChange={($event) => this.handleModule($event, mod, 'view')}
                                                    checked={this.state.module[mod] ? this.state.module[mod].view : undefined}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="create"
                                                    name="create"
                                                    onChange={($event) => this.handleModule($event, mod, 'create')}
                                                    checked={this.state.module[mod] ? this.state.module[mod].create : undefined}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="edit"
                                                    name="edit"
                                                    onChange={($event) => this.handleModule($event, mod, 'edit')}
                                                    checked={this.state.module[mod] ? this.state.module[mod].edit : undefined}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="delete"
                                                    name="delete"
                                                    onChange={($event) => this.handleModule($event, mod, 'delete')}
                                                    checked={this.state.module[mod] ? this.state.module[mod].delete : undefined}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td colSpan={6}>
                                        <Button variant="primary">
                                            <i className="fa fa-plus mr-2"></i>
                                            Add Module
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.createRole()}>Submit</Button>
                </Modal.Footer>
            </>
        )
    }
}

export default Roles;