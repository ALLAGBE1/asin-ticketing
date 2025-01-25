import axios from 'axios';
import { ComplaintObjectModel } from '../models/ComplaintObject';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const COMPLAINT_OBJECT_URL = `${API_URL}/api/v1/objects`;

export class ComplaintObjectRequest {
  addComplaintObject(complaintObject: ComplaintObjectModel) {
    return axios.post(
      COMPLAINT_OBJECT_URL +
        `?category_id=${complaintObject.category_id}&severity_level_id=${complaintObject.severity_level_id}&duration_treatment_id=${complaintObject.duration_treatment_id}`,
      complaintObject,
    );
  }

  updateComplaintObject(complaintObject: ComplaintObjectModel) {
    return axios.put(
      COMPLAINT_OBJECT_URL +
        `/${complaintObject.id}?category_id=${complaintObject.category_id}&severity_level_id=${complaintObject.severity_level_id}&duration_treatment_id=${complaintObject.duration_treatment_id}`,
      complaintObject,
    );
  }

  getComplaintObjectList(page = 1, size = 200) {
    return axios.get<ComplaintObjectModel>(
      COMPLAINT_OBJECT_URL + `?page=${page}&size=${size}`,
    );
  }

  getComplaintObjectListByCategpriId(category_id: number) {
    return axios.get<ComplaintObjectModel>(
      `${API_URL}/api/v1/objects_by_category/` + category_id,
    );
  }

  deleteComplaintObject(complaintObjectId: number) {
    return axios.delete(COMPLAINT_OBJECT_URL + `/${complaintObjectId}`);
  }
}
