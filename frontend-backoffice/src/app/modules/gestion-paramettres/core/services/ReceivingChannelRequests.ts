import axios from 'axios';
import { ReceivingChannelModel } from '../models/ReceivingChannel';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const RECEIVING_CHANNEL_URL = `${API_URL}/api/v1/reception_channels`;

export class ReceivingChannelRequest {
  addReceivingChannel(ReceivingChannel: ReceivingChannelModel) {
    return axios.post(RECEIVING_CHANNEL_URL, ReceivingChannel);
  }

  updateReceivingChannel(ReceivingChannel: ReceivingChannelModel) {
    return axios.put(
      RECEIVING_CHANNEL_URL + `/${ReceivingChannel.id}`,
      ReceivingChannel,
    );
  }

  getReceivingChannelList(page = 1, size = 200) {
    return axios.get<ReceivingChannelModel>(
      RECEIVING_CHANNEL_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteReceivingChannel(ReceivingChannelId: number) {
    return axios.delete(RECEIVING_CHANNEL_URL + `/${ReceivingChannelId}`);
  }
}
