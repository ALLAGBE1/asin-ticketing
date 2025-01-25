import axios from 'axios';
import { ComplaintTypeModel } from '../models/ComplaintType';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const COMPLAINT_TYPE_URL = `${API_URL}/api/v1/satis-assurance/claim_type/`;

export class ComplaintTypeRequest {
  addComplaintType(complaintType: ComplaintTypeModel) {
    return axios.post(COMPLAINT_TYPE_URL, complaintType);
  }

  updateComplaintType(complaintType: ComplaintTypeModel) {
    return axios.put(
      COMPLAINT_TYPE_URL + `/${complaintType.id}`,
      complaintType,
    );
  }

  getComplaintTypeList(page = 1, size = 200) {
    return axios.get<ComplaintTypeModel>(
      COMPLAINT_TYPE_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteComplaintType(complaintTypeId: number) {
    return axios.delete(COMPLAINT_TYPE_URL + `/${complaintTypeId}`);
  }
}
