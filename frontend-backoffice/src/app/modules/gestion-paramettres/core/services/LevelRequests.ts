import axios from 'axios';
import { LevelModel } from '../models/Level';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const LEVEL_URL = `${API_URL}/api/v1/levels`;

export class LevelRequests {
  addLevel(Level: LevelModel) {
    return axios.post(LEVEL_URL, Level);
  }

  updateLevel(Level: LevelModel) {
    return axios.put(LEVEL_URL + `/${Level.id}`, Level);
  }

  getLevelList(page = 1, size = 200) {
    return axios.get<LevelModel>(LEVEL_URL + `?page=${page}&size=${size}`);
  }

  deleteLevel(LevelId: number) {
    return axios.delete(LEVEL_URL + `/${LevelId}`);
  }
}
