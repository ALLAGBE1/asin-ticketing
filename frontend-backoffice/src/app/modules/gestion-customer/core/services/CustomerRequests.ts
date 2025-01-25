/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { CustomerModel } from '../models/Customer';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const CUSTUMER_URL = `${API_URL}/api/v1/customers`;

const USER_DATAS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

//@ts-ignore
const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

export class CustomerRequest {
  addCustumer(Custumer: CustomerModel) {
    return axios.post(
      CUSTUMER_URL + `?customer_type_id=${Custumer.customer_type_id}&institution_id=${user_datas.unity.institution.id}`,
      Custumer,
    );
  }

  updateCustumer(Custumer: CustomerModel) {
    return axios.put(CUSTUMER_URL + `/${Custumer.id}`, Custumer);
  }

  // http://45.67.221.134:8002/api/v1/customers?institution_id=4&page=1&size=10
  getCustumerList(page: number, size: number, institution_id:number) {
    page++;
    return axios.get<CustomerModel>(
      CUSTUMER_URL + `?page=${page}&size=${size}${institution_id ? '&institution_id='+institution_id : ''}`,
    );
  }

  getFilteredCustumerListByName(key: string) {
    return axios.get<CustomerModel>(
      CUSTUMER_URL + `/filter/?first_name=${key}&last_name=${key}`,
    );
  }

  deleteCustumer(CustumerId: number) {
    return axios.delete(CUSTUMER_URL + `/${CustumerId}`);
  }
}
