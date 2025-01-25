import axios from 'axios';
import { ClaimSatisfactionModel } from '../models/ClaimSatisfaction';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_SATISFACTION_URL = `${API_URL}/api/v1/satisfaction/`;

export class ClaimSatisfactionFormRequests {
  addClaimSatisfactionForm(
    claimSatisfactionForm: ClaimSatisfactionModel,
    claim_Id: string,
    level_Id: string,
  ) {
    return axios.post(
      CLAIM_SATISFACTION_URL + `${claim_Id}/${level_Id}`,
      claimSatisfactionForm,
    );
  }

  getClaimSatisfactionFormById(claimId:number) {
      return axios.get<ClaimSatisfactionModel>(CLAIM_SATISFACTION_URL + `${claimId}`);
  }

  // updateClaimSatisfactionForm(claimSatisfactionForm: ClaimSatisfactionModel) {
  //     return axios.put(CLAIM_SATISFACTION_URL + `/${claimSatisfactionForm.id}`, claimSatisfactionForm);
  // }

  // getClaimSatisfactionFormList() {
  //     return axios.get<ClaimSatisfactionModel>(CLAIM_SATISFACTION_URL + 'list');
  // }

  // deleteClaimSatisfactionForm(ClaimSatisfactionFormId: number) {
  //     return axios.delete(CLAIM_SATISFACTION_URL + `/${ClaimSatisfactionFormId}`);
  // }
}
