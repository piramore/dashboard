import React from 'react';
import Sidebar from '../components/Sidebar';
import { getUser } from '../helpers/Storage';

class Home extends React.Component {
  state = {
    currentUser: {
      _id: '',
      name: '',
      email: '',
      role: ''
    }
  }

  componentDidMount() {
    let currentUser = getUser();
    this.setState({ currentUser });
  }

  render() {
    return (
      <>
        <div style={{ fontSize: '3rem', textAlign: 'center', marginTop: '100px' }}>
          Hello, <span style={{ fontWeight: 'bold' }}>{ this.state.currentUser.name }</span>!
        </div>
        <Sidebar></Sidebar>
      </>
    )
  }
}

export default Home;