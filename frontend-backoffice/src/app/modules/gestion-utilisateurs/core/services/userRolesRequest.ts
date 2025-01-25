/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { UserRoleModel } from '../models/userRole';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CORE_URL = `${API_URL}/api/v1/core/`;

const USER_ROLE_URL = `${API_URL}/api/v1/core/roles`;

export class UserRolesRequest {
  addUserRole(userRole: UserRoleModel) {
    return axios.post(USER_ROLE_URL, userRole);
  }

  addRoleWithItsPermissions(userRole: any) {
    return axios.post(USER_ROLE_URL + '/permissions', userRole);
  }

  affectRoleToUser(userId: number, roleId: number) {
    return axios.post(CORE_URL + `roles/${roleId}/user/${userId}`);
  }

  updateUserRole(userRole: UserRoleModel) {
    return axios.put(USER_ROLE_URL + `/${userRole.id}`, userRole);
  }

  getUserRoleList(page = 1, size = 100) {
    return axios.get<UserRoleModel>(
      USER_ROLE_URL + `?page=${page}&size=${size}`,
    );
  }

  getUserRoleById(role_id: string) {
    return axios.get<UserRoleModel>(USER_ROLE_URL + `/${role_id}`);
  }

  getUserRoleByUserId(user_id: number) {
    return axios.get<any>(USER_ROLE_URL + `/user/${user_id}`);
  }

  deleteUserRole(userRoleId: number) {
    return axios.delete(USER_ROLE_URL + `/${userRoleId}`);
  }

  unLinkRoleFromUser(userRoleId: number, userId: number) {
    return axios.delete(USER_ROLE_URL + `/${userRoleId}/user/${userId}`);
  }

  linkPermissionsToRole(roleId: number, permissions: any) {
    return axios.post(CORE_URL + `roles/${roleId}/permissions`, permissions);
  }

  unlinkPermissionsToRole(permissionId: number, roleId: number) {
    return axios.delete(
      CORE_URL + `roles/${roleId}/permission/${permissionId}`,
    );
  }
}
