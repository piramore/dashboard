import React from 'react';

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
    let currentUser = JSON.parse(localStorage.getItem("user"));
    this.setState({ currentUser });
  }

  render() {
    return (
      <>
        <div style={{ fontSize: '3rem', textAlign: 'center', marginTop: '100px' }}>
          Hello, <span style={{ fontWeight: 'bold' }}>{ this.state.currentUser.name }</span>!
        </div>
      </>
    )
  }
}

export default Home;