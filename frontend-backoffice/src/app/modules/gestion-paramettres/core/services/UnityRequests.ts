/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { UnityModel } from '../models/Unity';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const UNITY_URL = `${API_URL}/api/v1/unities`;

const USER_DATAS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

//@ts-ignore
const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

export class UnityRequest {
  addUnity(Unity: UnityModel) {
    return axios.post(
      UNITY_URL +
        `?institution_id=${Unity.institution_id}&unity_type_id=${Unity.unity_type_id}`,
      Unity,
    );
  }

  updateUnity(Unity: UnityModel) {
    return axios.put(UNITY_URL + `/${Unity.id}`, Unity);
  }

  getUnityList(page = 1, size = 200) {
    return axios.get<UnityModel>(UNITY_URL + `?page=${page}&size=${size}`);
  }

  getUnityListByInstitutionId(institution_id: number = user_datas.unity.institution.id, page = 1, size = 200) {
    return axios.get<UnityModel>(
      API_URL + `/api/v1/unities_by_institution/${institution_id}?page=${page}&size=${size}`,
    );
  }

  deleteUnity(UnityId: number) {
    return axios.delete(UNITY_URL + `/${UnityId}`);
  }
}
