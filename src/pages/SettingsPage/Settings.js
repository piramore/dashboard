import React from 'react';
import Sidebar from '../../components/Sidebar';
import Roles from './Roles';
import AllUsers from './Users';

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeTabs: 'admin'
    }

    changeTabs = tabs => this.setState({ activeTabs: tabs });

    render() {
        return (
            <div>
                <div className="navtab">
                    <div className={'item' + (this.state.activeTabs === 'admin' ? ' active' : '')}
                        onClick={() => this.changeTabs('admin')}>
                        All Users
                    </div>
                    <div className={'item' + (this.state.activeTabs === 'role' ? ' active' : '')}
                        onClick={() => this.changeTabs('role')}>
                        Role
                    </div>
                    <div className={'item' + (this.state.activeTabs === 'module' ? ' active' : '')}
                        onClick={() => this.changeTabs('module')}>
                        Module
                    </div>
                </div>
                <div className="pt-4">
                    {
                        this.state.activeTabs === 'admin' &&
                        <AllUsers/>
                    }
                    {
                        this.state.activeTabs === 'role' &&
                        <Roles/>
                    }
                </div>
                <Sidebar/>
            </div>
        )
    }
}

export default Settings;