import axios from 'axios';
import { SeverityLevelModel } from '../models/SeverityLevel';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const SeverityLevel_URL = `${API_URL}/api/v1/severity_levels`;

export class SeverityLevelRequest {
  addSeverityLevel(SeverityLevel: SeverityLevelModel) {
    return axios.post(SeverityLevel_URL, SeverityLevel);
  }

  updateSeverityLevel(SeverityLevel: SeverityLevelModel) {
    return axios.put(SeverityLevel_URL + `/${SeverityLevel.id}`, SeverityLevel);
  }

  getSeverityLevelList(page = 1, size = 200) {
    return axios.get<SeverityLevelModel>(
      SeverityLevel_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteSeverityLevel(SeverityLevelId: number) {
    return axios.delete(SeverityLevel_URL + `/${SeverityLevelId}`);
  }
}
