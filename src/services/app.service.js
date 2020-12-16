import axios from 'axios';
import { SERVICE_HOST } from '../configs/Host.config';

export class AppService {
    constructor() {
        // this.hostPrefix = `http://${SERVICE_HOST}`;
        this.hostPrefix = `/api`;

        const token = localStorage.getItem("token");
        this.headers = { Authorization: `Bearer ${token}` };
    }

    // LOGIN STUFF

    login(email, password) {
        const params = { email, password };
        return axios.post(`${this.hostPrefix}/login`, params);
    }

    forgotPassword(email) {
        const params = { email };
        return axios.post(`${this.hostPrefix}/forgotpassword`, params);
    }

    resetPassword(token, newPassword) {
        const params = { newPassword };
        return axios.post(`${this.hostPrefix}/resetpassword/${token}`, params);
    }

    // ADMINS STUFF

    getAdmin() {
        return axios.get(`${this.hostPrefix}/admin/list`, { headers: this.headers });
    }

    createAdmin(name, email, password) {
        const params = { name, email, password };
        return axios.post(`${this.hostPrefix}/admin/create`, params, { headers: this.headers });
    }

    changePassword(password) {
        const params = { password };
        return axios.post(`${this.hostPrefix}/admin/update`, params, { headers: this.headers });
    }
}