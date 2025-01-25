import axios from 'axios';
import { InstitutionModel } from '../models/Institution';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const INSTITUTION_URL = `${API_URL}/api/v1/institutions`;

export class InstitutionRequest {
  addInstitution(Institution: InstitutionModel) {
    return axios.post(
      INSTITUTION_URL +
        `?institution_type_id=${Institution.type_institution_id}${Institution.logo_id ? '&logo_id=' + Institution.logo_id : ''}`,
      Institution,
    );
  }

  updateInstitution(Institution: InstitutionModel) {
    return axios.put(INSTITUTION_URL + `/${Institution.id}`, Institution);
  }

  getInstitutionList(page = 1, size = 200) {
    return axios.get<InstitutionModel>(
      INSTITUTION_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteInstitution(InstitutionId: number) {
    return axios.delete(INSTITUTION_URL + `/${InstitutionId}`);
  }
}
