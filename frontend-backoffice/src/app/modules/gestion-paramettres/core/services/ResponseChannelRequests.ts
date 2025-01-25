import axios from 'axios';
import { ResponseChannelModel } from '../models/ResponseChannel';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const RESPONSE_CHANNEL_URL = `${API_URL}/api/v1/response_channels`;

export class ResponseChannelRequest {
  addResponseChannel(ResponseChannel: ResponseChannelModel) {
    return axios.post(RESPONSE_CHANNEL_URL, ResponseChannel);
  }

  updateResponseChannel(ResponseChannel: ResponseChannelModel) {
    return axios.put(
      RESPONSE_CHANNEL_URL + `/${ResponseChannel.id}`,
      ResponseChannel,
    );
  }

  getResponseChannelList(page = 1, size = 200) {
    return axios.get<ResponseChannelModel>(
      RESPONSE_CHANNEL_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteResponseChannel(ResponseChannelId: number) {
    return axios.delete(RESPONSE_CHANNEL_URL + `/${ResponseChannelId}`);
  }
}
