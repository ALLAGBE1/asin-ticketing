import axios from 'axios';
import { MailServerModel, SmsServerModel } from '../models/NotificationServer';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const MAIL_SERVER_URL = `${API_URL}/api/v1/config_mail`;
const SMS_SERVER_URL = `${API_URL}/api/v1/config_sms`;

export class NotificationServerRequests {
  addEmailServerData(serverData: MailServerModel) {
    return axios.post(MAIL_SERVER_URL, serverData);
  }

  getEmailServerData() {
    return axios.get<MailServerModel>(MAIL_SERVER_URL);
  }

  addSmsServerData(serverData: SmsServerModel) {
    return axios.post(SMS_SERVER_URL, serverData);
  }

  getSmsServerData() {
    return axios.get<SmsServerModel>(SMS_SERVER_URL);
  }
}
