import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_URL = `${API_URL}/api/v1/claims`;

export class StatsRequests {
  getClaimsStatsForWholeApp(time_period: number) {
    return axios.get<unknown>(CLAIM_URL + `/stats/?period=${time_period}`);
  }

  getClaimsStatsForInstitution(time_period: number, institution_id?: number) {
    return axios.get<unknown>(
      CLAIM_URL +
        `/stats/?period=${time_period}&institution_id=${institution_id}`,
    );
  }

  getClaimsStatsByReceptionChannelByTimePeriode(month: number) {
    return axios.get<unknown>(
      CLAIM_URL +
        `/by_reception_channel/?year=${new Date().getFullYear()}&month=${month}`,
    );
  }

  getClaimsStatsByRObjectsTimePeriode(month: number, year:number) {
    return axios.get<unknown>(
      CLAIM_URL +
        `/by_object/?year=${year}&month=${month}`,
    );
  }
  getClaimsStatsOfStatusByMonth(year: number) {
    return axios.get<unknown>(
      CLAIM_URL + `/by_status/?year=${year}`,
    );
  }

  getClaimsStatsRateForAllInstitution() {
    return axios.get<unknown>(CLAIM_URL + `/rate/`);
  }
}
