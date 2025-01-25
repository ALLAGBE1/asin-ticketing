/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
// const CUSTUMER_URL = `${API_URL}/api/v1/customers`;

const USER_DATAS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

//@ts-ignore
const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

export class LogsRequest {
  getUsersLoginLogs(
    page: number = 1,
    limit: number = 10,
    institution_id?: number | null,
    user_id?: number | null,
    name_or_email?: string | null,
  ) {
    return axios.get(
      API_URL +
        `/api/v1/logs?page=${page}&size=${limit}${institution_id ? '&institution_id=' + institution_id : ''}${user_id ? '&user_id=' + user_id : ''}${name_or_email ? '&name=' + name_or_email : ''}${name_or_email ? '&email=' + name_or_email : ''}`,
    );
  }
}
