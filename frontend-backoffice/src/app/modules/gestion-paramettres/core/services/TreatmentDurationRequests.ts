import axios from 'axios';
import { TreatmentDurationModel } from '../models/TreatmentDuration';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const TreatmentDuration_URL = `${API_URL}/api/v1/duration_treatments`;

export class TreatmentDurationRequest {
  addTreatmentDuration(TreatmentDuration: TreatmentDurationModel) {
    return axios.post(TreatmentDuration_URL, TreatmentDuration);
  }

  updateTreatmentDuration(TreatmentDuration: TreatmentDurationModel) {
    return axios.put(
      TreatmentDuration_URL + `/${TreatmentDuration.id}`,
      TreatmentDuration,
    );
  }

  getTreatmentDurationList(page = 1, size = 200) {
    return axios.get<TreatmentDurationModel>(
      TreatmentDuration_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteTreatmentDuration(TreatmentDurationId: string) {
    return axios.delete(TreatmentDuration_URL + `/${TreatmentDurationId}`);
  }
}
