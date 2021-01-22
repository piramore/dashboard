import React from 'react';
import Avatar from '../assets/images/avatar.png';
import Sidebar from '../components/Sidebar';
import { Notyf } from 'notyf';
import { AppService } from '../services/AppService';
import { Spinner } from 'react-bootstrap';

class MyProfile extends React.Component {
  constructor() {
    super();
    this.appService = new AppService();
    this.notyf = new Notyf();
  }

  state = {
    userData: {
      id: '',
      name: '',
      email: '',
      role: [''],
      module: []
    },
    loadingUserData: true,
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    this.appService.getCurrentAdmin().then(
      response => {
        this.setState({ loadingUserData: false });
        if (response.data.success == false) {
          throw(response.data.message);
        }
        this.setState({ userData: {
          id: response.data.admin._id,
          name: response.data.admin.name,
          email: response.data.admin.email,
          role: response.data.admin.role,
          module: response.data.admin.module
        } });
      },

      error => {
        this.setState({ loadingUserData: false });
        console.error(error);
        if (typeof error === 'string') this.notyf.error(error);
        else this.notyf.error('Failed getting admin data');
      }
    )
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center" style={{ height: 600 }}>
          {
            this.state.loadingUserData ?
            <Spinner animation="border" as="div" size="lg"/> :
            <div className="text-center">
              <img
                src={Avatar}
                className="rounded-circle mb-2"
                alt="Avatar"
                style={{ width: 200, height: 200 }}
              />
              <div className="mb-4">
                <div className="font-weight-bold" style={{ fontSize: '2rem' }}>
                  {this.state.userData.name}
                </div>
                <div className="text-muted">
                  {this.state.userData.email}
                </div>
              </div>
              <div>
                <i className="fa fa-shield-alt mr-2"></i>
                {this.state.userData.role[0].name}
              </div>
            </div>
          }
        </div>
        <Sidebar/>
      </>
    )
  }
}

export default MyProfile;