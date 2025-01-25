import axios from 'axios';
import { ComplaintCategoryModel } from '../models/ComplaintCategory';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const COMPLAINT_CATEGORY_URL = `${API_URL}/api/v1/categories`;

export class ComplaintCategoryRequest {
  addComplaintCategory(complaintCat: ComplaintCategoryModel) {
    return axios.post(
      COMPLAINT_CATEGORY_URL +
        `?insurance_type_id=${complaintCat.insurance_type_id}`,
      complaintCat,
    );
  }

  updateComplaintCategory(complaintCat: ComplaintCategoryModel) {
    return axios.put(
      COMPLAINT_CATEGORY_URL + `/${complaintCat.id}`,
      complaintCat,
    );
  }

  getComplaintCategoriesList(page = 1, size = 200) {
    return axios.get(COMPLAINT_CATEGORY_URL + `?page=${page}&size=${size}`);
  }

  deleteComplaintCategory(complaintCatId: number) {
    return axios.delete(COMPLAINT_CATEGORY_URL + `/${complaintCatId}`);
  }
}
