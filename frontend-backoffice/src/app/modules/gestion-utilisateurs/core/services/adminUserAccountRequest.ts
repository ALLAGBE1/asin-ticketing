/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { UserAccountModel } from '../models/userAccount';
import { UserProfileModel } from '../models/userProfile';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const USERS_ACCOUNTS_URL = `${API_URL}/api/v1/admin/users/`;

export class AdminUserAccountRequest {
  // addAdminAccount(userAccount: UserAccountModel) {
  //     return axios.post(USERS_ACCOUNTS_URL, userAccount);
  // }

  // http://45.67.221.134:8002/api/v1/admin/users?role_id=51&institution_id=5&is_active=true&page=1&size=10

  getFilteredUser(
    institution_id: number,
    is_active: boolean,
    role_id: number,
    page = 1,
    size = 50,
    name: string,
    email: string,
  ) {
    return axios.get<UserAccountModel>(
      USERS_ACCOUNTS_URL +
        `?page=${page}&size=${size}${role_id ? '&role_id=' + role_id : ''}${institution_id ? '&institution_id=' + institution_id : ''}${is_active ? '&is_active=' + is_active : ''}${name ? '&name=' + name : ''}${email ? '&email=' + email : ''}`,
    );
  }

  getAdminUsersList(page = 1, size = 50) {
    return axios.get<UserAccountModel>(
      USERS_ACCOUNTS_URL + `?page=${page}&size=${size}`,
    );
  }

  getUsersListByRoleId(role_id: number, page?: number, size?: number) {
    return axios.get<UserAccountModel>(
      `${API_URL}/api/v1/users/filter_by_role?role_id=${role_id}`,
    );
  }

  getAdminById(adminId: number) {
    return axios.get<UserAccountModel>(USERS_ACCOUNTS_URL + `/${adminId}`);
  }

  updateAdminUserProfile(adminId: number, adminProfile: UserProfileModel) {
    return axios.put<UserAccountModel>(
      USERS_ACCOUNTS_URL + `/${adminId}/profile`,
      adminProfile,
    );
  }

  deleteAdminById(adminId: number) {
    return axios.delete<UserAccountModel>(USERS_ACCOUNTS_URL + `/${adminId}`);
  }
}
