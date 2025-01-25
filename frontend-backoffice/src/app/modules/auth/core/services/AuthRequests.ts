import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const AUTH_URL = `${API_URL}/api/v1/auth/`;

export class AuthRequests {
  login(email: string, password: string) {
    const authData = new FormData();
    authData.append('username', email);
    authData.append('password', password);

    return axios.post(AUTH_URL + 'login', authData);
  }

  forgotPassword(email: string) {
    return axios.get(AUTH_URL + 'forgot_password/' + email);
  }
}
