import axios from 'axios';
import { UserPermissionModel } from '../models/userPermission';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const USER_PERMISSION_URL = `${API_URL}/api/v1/core/permissions`;
const USER_ROLE_URL = `${API_URL}/api/v1/core/roles`;

export class UserPermissionRequest {
  addUserPermission(userPermission: UserPermissionModel) {
    return axios.post(USER_PERMISSION_URL, userPermission);
  }

  updateUserPermission(userPermission: UserPermissionModel) {
    return axios.put(
      USER_PERMISSION_URL + `/${userPermission.id}`,
      userPermission,
    );
  }

  getUserPermissionList(page = 1, size = 100) {
    return axios.get<UserPermissionModel>(
      USER_PERMISSION_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteUserPermission(userPermissionId: number) {
    return axios.delete(USER_PERMISSION_URL + `/${userPermissionId}`);
  }

  getUserPermissionListByRoleID(roleId: number) {
    return axios.get<UserPermissionModel>(
      USER_ROLE_URL + `/${roleId}/permissions`,
    );
  }
}
