import axios from 'axios';
import { ClaimFoundedModel } from '../models/ClaimFounded';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_FOUNDED_URL = `${API_URL}/api/v1/founded/`;

export class ClaimFoundedRequests {
  addClaimFound(claimFound: ClaimFoundedModel, claim_Id: string) {
    return axios.post(CLAIM_FOUNDED_URL + claim_Id, claimFound);
  }

  getClaimFoundByClaimId(claimId: number) {
    return axios.get<ClaimFoundedModel>(
      CLAIM_FOUNDED_URL + `filter_by_claims/${claimId}`,
    );
  }
}
