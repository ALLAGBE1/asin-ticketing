/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toISOString } from '../../../../utils/functions';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
// const CUSTUMER_URL = `${API_URL}/api/v1/customers`;

export class ReportingRequests {
  getReportings(category_id?:number | string, object_id?:number | string, unity_id?:number | string, reception_channel_id?:number | string, start_date?:string | Date | any, end_date?:string | Date | any) {
    const _start_date = new Date(start_date);
    const _end_date = new Date(end_date);
    return axios.get(API_URL + `/api/v1/claims/reporting/?${end_date ? 'end_date=' + toISOString(_end_date) : ''}${start_date && start_date != '0' ? '&start_date=' + toISOString(_start_date) : ''}${category_id && category_id != '0' ? '&category_id=' + category_id : ''}${unity_id && unity_id != '0' ? '&unity_id=' + unity_id : ''}${object_id && object_id != '0' ? '&object_id=' + object_id : ''}${reception_channel_id && reception_channel_id != '0' ? '&reception_channel_id=' + reception_channel_id : ''}`);
  }
  getUnprocessedReportings(category_id?:number | string, object_id?:number | string, unity_id?:number | string, reception_channel_id?:number | string, start_date?:string | Date | any, end_date?:string | Date | any) {
    const _start_date = new Date(start_date);
    const _end_date = new Date(end_date);
    return axios.get(API_URL + `/api/v1/claims/reporting/unprocessed/?${end_date ? 'end_date=' + toISOString(_end_date) : ''}${start_date ? '&start_date=' + toISOString(_start_date) : ''}${category_id ? '&category_id=' + category_id : ''}${unity_id ? '&unity_id=' + unity_id : ''}${object_id ? '&object_id=' + object_id : ''}${reception_channel_id ? '&reception_channel_id=' + reception_channel_id : ''}`);
  }
  getReportingsAnalitics(start_date:string | Date, end_date:string | Date) {
    const _start_date = new Date(start_date);
    const _end_date = new Date(end_date);
    return axios.get(API_URL + `/api/v1/claims/reporting/analytics/?${end_date ? 'end_date=' + toISOString(_end_date) : ''}${start_date ? '&start_date=' + toISOString(_start_date) : ''}`);
  }
}
