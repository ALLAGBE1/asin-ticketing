import axios from 'axios';
import { InstitutionTypeModel } from '../models/InstitutionType';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const INSTITUTION_TYPE_URL = `${API_URL}/api/v1/institution_types`;

export class InstitutionTypeRequest {
  addInstitutionType(InstitutionType: InstitutionTypeModel) {
    return axios.post(INSTITUTION_TYPE_URL, InstitutionType);
  }

  updateInstitutionType(InstitutionType: InstitutionTypeModel) {
    return axios.put(
      INSTITUTION_TYPE_URL + `/${InstitutionType.id}`,
      InstitutionType,
    );
  }

  getInstitutionTypeList(page = 1, size = 200) {
    return axios.get<InstitutionTypeModel>(
      INSTITUTION_TYPE_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteInstitutionType(InstitutionTypeId: number) {
    return axios.delete(INSTITUTION_TYPE_URL + `/${InstitutionTypeId}`);
  }
}
