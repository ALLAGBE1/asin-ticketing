import axios from 'axios';
import { CurrencyModel } from '../models/Currency';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const CURRENCY_URL = `${API_URL}/api/v1/currencies`;

export class CurrencyRequest {
  addCurrency(Currency: CurrencyModel) {
    return axios.post(CURRENCY_URL, Currency);
  }

  updateCurrency(Currency: CurrencyModel) {
    return axios.put(CURRENCY_URL + `/${Currency.id}`, Currency);
  }

  getCurrencyList(page = 1, size = 200) {
    return axios.get<CurrencyModel>(
      CURRENCY_URL + `?page=${page}&size=${size}`,
    );
  }

  deleteCurrency(CurrencyId: number) {
    return axios.delete(CURRENCY_URL + `/${CurrencyId}`);
  }
}
