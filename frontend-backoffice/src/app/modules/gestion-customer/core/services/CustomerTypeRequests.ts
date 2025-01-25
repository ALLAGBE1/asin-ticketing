import axios from 'axios';
import { CustomerTypeModel } from '../models/CustomerType';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const CUSTUMER_TYPE_URL = `${API_URL}/api/v1/customer_types`;

export class CustomerTypeRequest {
  addCustumerType(CustumerType: CustomerTypeModel) {
    return axios.post(CUSTUMER_TYPE_URL, CustumerType);
  }

  updateCustumerType(CustumerType: CustomerTypeModel) {
    return axios.put(CUSTUMER_TYPE_URL + `/${CustumerType.id}`, CustumerType);
  }

  getCustumerTypeList(page: number, size = 10) {
    page++;
    return axios.get<CustomerTypeModel>(
      CUSTUMER_TYPE_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteCustumerType(CustumerTypeId: number) {
    return axios.delete(CUSTUMER_TYPE_URL + `/${CustumerTypeId}`);
  }
}
