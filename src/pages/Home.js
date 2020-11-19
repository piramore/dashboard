import React from 'react';

class Home extends React.Component {
  state = {
    currentUser: {
      username: '',
      id: 0
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
          Hello, <span style={{ fontWeight: 'bold' }}>{ this.state.currentUser.username }</span>!
        </div>
      </>
    )
  }
}

export default Home;