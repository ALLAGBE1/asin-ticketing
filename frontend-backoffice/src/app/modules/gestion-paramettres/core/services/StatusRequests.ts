import axios from 'axios';
import { StatusModel } from '../models/Status';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const STATUS_URL = `${API_URL}/api/v1/statuses`;

export class StatusRequest {
  addStatus(Status: StatusModel) {
    return axios.post(STATUS_URL, Status);
  }

  updateStatus(Status: StatusModel) {
    return axios.put(STATUS_URL + `/${Status.id}`, Status);
  }

  getStatusList(page = 1, size = 200) {
    return axios.get<StatusModel>(STATUS_URL + `?page=${page}&size=${size}`);
  }

  deleteStatus(StatusId: number) {
    return axios.delete(STATUS_URL + `/${StatusId}`);
  }
}
