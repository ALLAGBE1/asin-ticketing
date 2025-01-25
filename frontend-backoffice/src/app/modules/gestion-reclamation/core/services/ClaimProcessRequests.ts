import axios from 'axios';
import { ClaimProcessModel } from '../models/ClaimProcess';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_PROCESS_URL = `${API_URL}/api/v1/process`;

export class ClaimProcessRequests {
  addClaimProcess(ClaimProcess: ClaimProcessModel, claimId: number) {
    return axios.post(CLAIM_PROCESS_URL + `/${claimId}`, ClaimProcess);
  }

  validateProcess(ClaimProcess: ClaimProcessModel, claimId: number) {
    return axios.put(CLAIM_PROCESS_URL + `/validate/${claimId}?message=${ClaimProcess.message_to_send}`, ClaimProcess);
  }

  notifyProcessToClient(claimId: number) {
    return axios.put(CLAIM_PROCESS_URL + `/resend_notif/${claimId}`);
  }

  updateClaimProcess(Claim: ClaimProcessModel) {
    return axios.put(CLAIM_PROCESS_URL + `/${Claim.id}`, Claim);
  }

  getClaimProcessList() {
    return axios.get<ClaimProcessModel>(CLAIM_PROCESS_URL + 'list');
  }

  getClaimProcessById(claimProcessId: number) {
    return axios.get<ClaimProcessModel>(
      CLAIM_PROCESS_URL + `/${claimProcessId}`,
    );
  }

  getClaimProcessByClaimId(claimId: number) {
    return axios.get<ClaimProcessModel>(
      API_URL + `/api/v1/process_by_claim/${claimId}`,
    );
  }

  deleteClaimProcess(ClaimProcessId: number) {
    return axios.delete(CLAIM_PROCESS_URL + `/${ClaimProcessId}`);
  }
}
