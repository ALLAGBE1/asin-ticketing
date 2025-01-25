/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Profile } from '../models/profile';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
// const CUSTUMER_URL = `${API_URL}/api/v1/customers`;

export class ProfileRequest {
  updateUserProfile(profile: Profile) {
    return axios.put(
      API_URL + `/api/v1/admin/users/${profile.id}/profile`,
      profile,
    );
  }

  updatePassword(actual_password: string, new_password: string) {
    return axios.post(
      API_URL +
        `/api/v1/auth/modify_password/?actual_password=${actual_password}&new_password=${new_password}`,
      {},
    );
  }

  reInitUserPassword(userId: number, new_password: string) {
    return axios.post(
      API_URL +
        `/api/v1/auth/modify_user_password/${userId}?new_password=${new_password}`,
      {},
    );
  }

  activateUser(userId: number) {
    return axios.post(API_URL + `/api/v1/auth/activate_user/${userId}`, {});
  }

  deactivateUser(userId: number) {
    return axios.post(API_URL + `/api/v1/auth/deactivate_user/${userId}`, {});
  }
}
