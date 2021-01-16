import axios from 'axios';
import { APP_API } from '../configs/AppConfig';

export class AppService {
    constructor() {
        // this.hostPrefix = `http://${SERVICE_HOST}`;
        this.hostPrefix = `/api`;

        const token = localStorage.getItem("token");
        this.headers = { Authorization: `Bearer ${token}` };
    }

    // LOGIN STUFF

    login(email, password) {
        console.log('api =>', APP_API);
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

    createAdmin(name, email, password, role) {
        const params = { name, email, password, role };
        return axios.post(`${this.hostPrefix}/admin/create`, params, { headers: this.headers });
    }

    changePassword(password) {
        const params = { password };
        return axios.post(`${this.hostPrefix}/admin/update`, params, { headers: this.headers });
    }

    deleteAdmin(adminid, role) {
        const params = { adminid, role };
        return axios.post(`${this.hostPrefix}/admin/${adminid}/delete`, params, { headers: this.headers });
    }

    // ROLE STUFF

    createRole(name, desc, module, levelAccess) {
        const params = { name, desc, module, levelAccess };
        return axios.post(`${this.hostPrefix}/createrole`, params, { headers: this.headers });
    }

    addRole(email, roleId) {
        const params = { email, role: roleId };
        return axios.post(`${this.hostPrefix}/addrole`, params, { headers: this.headers });
    }

    getRole() {
        return axios.get(`${this.hostPrefix}/rolelist`, { headers: this.headers });
    }
}