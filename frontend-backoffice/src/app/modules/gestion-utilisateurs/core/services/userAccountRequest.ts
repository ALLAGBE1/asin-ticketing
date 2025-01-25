/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { UserAccountModel } from '../models/userAccount';
import { UserModel } from '../../../auth';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const USER_URL = `${API_URL}/api/v1/users/`;

const AUTH_URL = `${API_URL}/api/v1/auth/`;

const CORE_URL = `${API_URL}/api/v1/core/`;

const ADMIN_URL = `${API_URL}/api/v1/admin/`;

export class UserAccountRequest {
  addUserRole(userAccount: UserAccountModel) {
    return axios.post(USER_URL, userAccount);
  }

  // updateUserRole(userAccount: UserAccountModel) {
  //     return axios.put(USER_URL + `/update/${userAccount.id}`, userAccount);
  // }

  getCurrentUserDatas() {
    return axios.get<UserModel>(USER_URL + 'current');
  }

  getCurrentUserDatasById(userId:number) {
    return axios.get<UserModel>(`${API_URL}/api/v1/admin/users/${userId}/claims`);
  }

  getUsersDatasByUnityId(unity_id: string) {
    return axios.get<UserModel>(
      `${API_URL}/api/v1/admin/users/filter_by_unity/${unity_id}?page=1&size=200`,
    );
  }

  updateCurrentUserDatas(userDatas: UserAccountModel) {
    return axios.put<UserAccountModel>(USER_URL + 'current/profile', userDatas);
  }

  addNewUser(userDatas: any, unity_id: number) {
    return axios.post(AUTH_URL + `signup?unity_id=${unity_id}`, userDatas);
  }

  updateUserDatas(
    userDatas: any,
    user_id: number,
    unity_id: number,
    job: string,
  ) {
    return axios.put(
      ADMIN_URL + `users/${user_id}?fonction=${job}&unity_id=${unity_id}`,
      userDatas,
    );
  }

  addNewUsersBulk(bulkFile: File) {
    const fileData = new FormData();
    fileData.append('file', bulkFile);

    return axios.post(AUTH_URL + `signup/bulk`, fileData);
  }

  affectRoleToUser(userId: string, roleId: string) {
    return axios.post(CORE_URL + `roles/${roleId}/user/${userId}`);
  }
}
