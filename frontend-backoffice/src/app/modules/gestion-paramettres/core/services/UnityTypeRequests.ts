import axios from 'axios';
import { UnityTypeModel } from '../models/UnityType';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const UNITY_TYPE_URL = `${API_URL}/api/v1/unity_types`;

export class UnityTypeRequest {
  addUnityType(UnityType: UnityTypeModel) {
    return axios.post(UNITY_TYPE_URL, UnityType);
  }

  updateUnityType(UnityType: UnityTypeModel) {
    return axios.put(UNITY_TYPE_URL + `/${UnityType.id}`, UnityType);
  }

  getUnityTypeList(page = 1, size = 200) {
    return axios.get<UnityTypeModel>(
      UNITY_TYPE_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteUnityType(UnityTypeId: number) {
    return axios.delete(UNITY_TYPE_URL + `/${UnityTypeId}`);
  }
}
