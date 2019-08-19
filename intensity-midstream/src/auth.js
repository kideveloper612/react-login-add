import axios from 'axios';
import environment from './global.js';
export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post(environment.apiUrl + `/login`, { username, password })
            .then(res => {
                if (res.data.status) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', res.data.username);
                }
                return resolve(res.data);
            })
    })
}

export const getAuth = () => {
    return {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
    }
}

export const logoutAuth = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    return true;
}
