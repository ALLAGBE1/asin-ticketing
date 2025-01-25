/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { AgencyModel } from '../models/Agency';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const AGENCY_URL = `${API_URL}/api/v1/agencies`;

export class AgencyRequest {

  addAgency(agency: AgencyModel, institutionId: number) {
    return axios.post(
      AGENCY_URL +
        `?institution_id=${institutionId}`,
      agency,
    );
  }

  updateAgency(agency: AgencyModel) {
    return axios.put(
      AGENCY_URL + `/${agency.id}`,
      agency,
    );
  }

  getAgencyList(page = 1, size = 200, institutionId?: number, searchKey?: string) {
    return axios.get(AGENCY_URL + `?page=${page}&size=${size}&institution_id=${institutionId}&libelle=${searchKey}`);
  }

  deleteAgency(agencyId: number) {
    return axios.delete(AGENCY_URL + `/${agencyId}`);
  }
}
