import axios from 'axios';
import { InsurranceTypeModel } from '../models/InsurranceType';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const INSURRANCE_TYPE_URL = `${API_URL}/api/v1/insurance_types`;

export class InsurranceTypeRequest {
  addInsurranceType(InsurranceType: InsurranceTypeModel) {
    return axios.post(INSURRANCE_TYPE_URL, InsurranceType);
  }

  updateInsurranceType(InsurranceType: InsurranceTypeModel) {
    return axios.put(
      INSURRANCE_TYPE_URL + `/${InsurranceType.id}`,
      InsurranceType,
    );
  }

  getInsurranceTypeList(page = 1, size = 200) {
    return axios.get<InsurranceTypeModel>(
      INSURRANCE_TYPE_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteInsurranceType(InsurranceTypeId: number) {
    return axios.delete(INSURRANCE_TYPE_URL + `/${InsurranceTypeId}`);
  }
}
