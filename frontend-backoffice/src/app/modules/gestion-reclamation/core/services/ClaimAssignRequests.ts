import axios from 'axios';
import { ClaimAssignModel } from '../models/ClaimAssign';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_ASSIGN_URL = `${API_URL}/api/v1/assign`;

export class ClaimAssignRequests {
  addClaimAssign(ClaimAssign: ClaimAssignModel) {
    return axios.post(
      CLAIM_ASSIGN_URL +
        `?claim_id=${ClaimAssign.claim_id}&unity_id=${ClaimAssign.unity_id}&user_id=${ClaimAssign.user_id}&process_id=${ClaimAssign.process_id}&founded_id=${ClaimAssign.founded_id}`,
      ClaimAssign,
    );
  }

  updateClaimAssign(Claim: ClaimAssignModel) {
    return axios.put(CLAIM_ASSIGN_URL + `/${Claim.id}`, Claim);
  }

  getClaimAssignList() {
    return axios.get<ClaimAssignModel>(CLAIM_ASSIGN_URL + 'list');
  }

  getClaimAssignById(claimId: number) {
    return axios.get<ClaimAssignModel>(CLAIM_ASSIGN_URL + `/${claimId}`);
  }

  deleteClaimAssign(ClaimAssignId: number) {
    return axios.delete(CLAIM_ASSIGN_URL + `/${ClaimAssignId}`);
  }
}
