import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../assets/images/avatar.png';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        menuToggle: false,
        currentUser: {}
    }

    componentDidMount() {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        this.setState({ currentUser });
    }

    render() {
        return (
            <div className="sidebarr">
                <div className="user-section"
                    onClick={() => this.setState({ menuToggle: !this.state.menuToggle })}>
                    <div className="d-flex align-items-center justify-content-end" style={{ gap: '20px' }}>
                        <div className="text-right">
                            <div className="name">{this.state.currentUser.name}</div>
                            <div className="role">{this.state.currentUser.email}</div>
                        </div>
                        <img src={Avatar} style={{ height: '70px' }} />
                        {/* <i className="fa fa-user mr-3" style={{ fontSize: '3rem' }}></i> */}
                    </div>
                </div>
                <div className={"menu-section" + (this.state.menuToggle ? '' : ' d-none')}>
                    <div className="pb-2">
                        <div className="title">Settings</div>
                        <Link to="/">
                            <div className="item">
                                <i className="fa fa-home mr-2"></i>
                                Home
                            </div>
                        </Link>
                        <Link to="/settings">
                            <div className="item">
                                <i className="fa fa-cog mr-2"></i>
                                User, Role, and Modules
                            </div>
                        </Link>
                    </div>
                    <div className="pb-2">
                        <div className="title">My Account</div>
                        <Link to="/changepassword">
                            <div className="item">
                                <i className="fa fa-key mr-2"></i>
                                Change Password
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className="item logout">
                                <i className="fa fa-power-off mr-2"></i>
                                Logout
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebar;