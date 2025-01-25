/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ClaimModel } from '../models/Claim';
import { dateWithMinutes } from '../../../../utils/functions';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;

const CLAIM_URL = `${API_URL}/api/v1/claims`;

const USER_DATAS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

//@ts-ignore
const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

export class ClaimRequest {
  // claim affected to the institution of the user connected
  addClaim(Claim: ClaimModel, claimProofs: Array<number>) {
    const _claim = {
      claims: Claim,
      proofs_ids: claimProofs ? claimProofs : [],
    };

    return axios.post(
      CLAIM_URL +
        `?customer_id=${Claim.customer_id}&reception_channel_id=${Claim.reception_channel_id}&response_channel_id=${Claim.response_channel_id}&status_id=${Claim.status_id}&institution_id=${user_datas.unity.institution.id}&object_id=${Claim.object_id}${Claim.currency_id ? '&currency_id=' + Claim.currency_id : ''}${Claim.agency_id ? '&agency_id=' + Claim.agency_id : ''}`,
      _claim,
    );
  }

  // claim affected to the institution of the user connected
  updateClaim(Claim: ClaimModel, claimProofs: Array<any>) {
    const _claim = {
      claims: Claim,
      proofs_ids: claimProofs ? claimProofs.map((proof) => proof.id) : [],
    };

    return axios.put(
      CLAIM_URL +
        `?customer_id=${Claim.customer_id}&reception_channel_id=${Claim.reception_channel_id}&response_channel_id=${Claim.response_channel_id}&status_id=${Claim.status_id}&institution_id=${user_datas.unity.institution.id}&object_id=${Claim.object_id}${Claim.currency_id ? '&currency_id=' + Claim.currency_id : ''}${Claim.agency_id ? '&agency_id=' + Claim.agency_id : ''}`,
      _claim,
    );
  }

  // claim affected to the institution of the user connected
  completeClaim(Claim: ClaimModel, claimProofs: Array<any>) {
    const _claim = {
      claims: Claim,
      proofs_ids: claimProofs,
    };

    console.log(_claim);

    return axios.put(
      CLAIM_URL +
        `/complete/${Claim.id}?customer_id=${Claim.customer_id}&reception_channel_id=${Claim.reception_channel_id}&response_channel_id=${Claim.response_channel_id}&status_id=${Claim.status_id}&institution_id=${user_datas.unity.institution.id}&object_id=${Claim.object_id}${Claim.currency_id ? '&currency_id=' + Claim.currency_id : ''}`,
      _claim,
    );
  }

  qualifyClaim(Claim: ClaimModel) {
    // const _claim = {
    //     "claims": Claim,
    //     "proofs_ids": claimProofs ? claimProofs : []
    // }

    return axios.put(
      CLAIM_URL + `/qualify/${Claim.id}?object_id=${Claim.object_id}`,
      Claim,
    );
  }

  // add multiple claims by excel file
  addMultipleClaimsByExcelFile(excelFile: File) {
    const formData = new FormData();

    formData.append('file', excelFile);

    return axios.post(`${API_URL}/api/v1/import_claim_from_excel`, formData);
  }

  assignClaimToUnity(claimId: number, unityId: number) {
    return axios.put(
      CLAIM_URL + `/assign_to_unity/${unityId}?claims_id=${claimId}`,
      {},
    );
  }

  assignClaimToUser(claimId: number, userId: number) {
    return axios.put(
      CLAIM_URL + `/assign_to_user/${userId}?claims_id=${claimId}`,
      {},
    );
  }

  // getClaimList() {
  //   return axios.get<ClaimModel>(CLAIM_URL + 'list');
  // }

  getClaimById(claimId: number) {
    return axios.get<ClaimModel>(CLAIM_URL + `/${claimId}`);
  }

  // getClaimFilteredList(response_channel_id: number, status_id: number, reference: string, page: number, size: number) {
  //     return axios.get<ClaimModel>(CLAIM_URL + `?page=${page}&size=${size}${ response_channel_id ? '&response_channel_id=' + response_channel_id :'' }${ status_id ? '&status_id=' + status_id :'' }${ reference ? '&reference=' + reference :'' }`);
  // }

  getClaimFilteredList(
    response_channel_id: number | null,
    status_id: number | null,
    reference: string | null,
    page: number,
    size: number,
  ) {
    // it's did like this because the back-end pagination's page start by 1 and materialPaginator pagination start by page 0
    page++;

    return axios.get<ClaimModel>(
      CLAIM_URL +
        '/filter/' +
        `?page=${page}&size=${size}&response_channel_id=${user_datas.unity.institution.id}${response_channel_id ? '&response_channel_id=' + response_channel_id : ''}${status_id ? '&status_id=' + status_id : ''}${reference ? '&reference=' + reference : ''}`,
    );
  }

  getUnFundedClaimFilteredList(
    response_channel_id: number | null,
    status_id: number | null,
    reference: string | null,
    page: number,
    size: number,
  ) {
    // it's did like this because the back-end pagination's page start by 1 and materialPaginator pagination start by page 0
    page++;
    return axios.get<ClaimModel>(
      CLAIM_URL +
        '/unfounded/' +
        `?page=${page}&size=${size}${response_channel_id ? '&response_channel_id=' + response_channel_id : ''}${status_id ? '&status_id=' + status_id : ''}${reference ? '&reference=' + reference : ''}`,
    );
  }

  getClaimFilteredListByAllOptions(
    reception_channel_id: number | null,
    response_channel_id: number | null,
    institution_id: number | null = user_datas.unity.institution.id,
    unity_id: number | null,
    user_id: number | null,
    customer_id: number | null,
    object_id: number | null,
    status_id: number | null,
    reference: string | null,
    level_id: number | null,
    startDate: string | null,
    endDate: string | null,
    page: number,
    size: number,
    with_satisfaction: boolean,
    client_name_or_client_email: string | null,
  ) {
    // it's did like this because the back-end pagination's page start by 1 and materialPaginator pagination start by page 0
    page++;

    return axios.get<ClaimModel>(
      CLAIM_URL +
        '/filter/' +
        `?page=${page}&size=${size}${response_channel_id ? '&response_channel_id=' + response_channel_id : ''}${reception_channel_id ? '&reception_channel_id=' + reception_channel_id : ''}${institution_id ? '&institution_id=' + institution_id : ''}${customer_id ? '&customer_id=' + customer_id : ''}${status_id ? '&status_id=' + status_id : ''}${reference ? '&reference=' + reference : ''}${object_id ? '&object_id=' + object_id : ''}${unity_id ? '&unity_id=' + unity_id : ''}${user_id ? '&user_id=' + user_id : ''}${level_id ? '&level_id=' + level_id : ''}${startDate ? '&start_date=' + dateWithMinutes(startDate) : ''}${endDate ? '&end_date=' + dateWithMinutes(endDate) : ''}${with_satisfaction ? '&with_satisfaction=' + with_satisfaction : ''}${client_name_or_client_email ? '&client_name=' + client_name_or_client_email : ''}`,
    );
  }

  getUnFundedClaimsFilteredListByAllOptions(
    reception_channel_id: number | null,
    response_channel_id: number | null,
    institution_id: number | null = user_datas.unity.institution.id,
    unity_id: number | null,
    user_id: number | null,
    customer_id: number | null,
    object_id: number | null,
    status_id: number | null,
    reference: string | null,
    level_id: number | null,
    startDate: string | null,
    endDate: string | null,
    page: number,
    size: number,
    client_name_or_client_email: string | null,
  ) {
    // it's did like this because the back-end pagination's page start by 1 and materialPaginator pagination start by page 0
    page++;

    return axios.get<ClaimModel>(
      CLAIM_URL +
        '/unfounded/' +
        `?page=${page}&size=${size}${response_channel_id ? '&response_channel_id=' + response_channel_id : ''}${reception_channel_id ? '&reception_channel_id=' + reception_channel_id : ''}${institution_id ? '&institution_id=' + institution_id : ''}${customer_id ? '&customer_id=' + customer_id : ''}${status_id ? '&status_id=' + status_id : ''}${reference ? '&reference=' + reference : ''}${object_id ? '&object_id=' + object_id : ''}${unity_id ? '&unity_id=' + unity_id : ''}${user_id ? '&user_id=' + user_id : ''}${level_id ? '&level_id=' + level_id : ''}${startDate ? '&start_date=' + dateWithMinutes(startDate) : ''}${endDate ? '&end_date=' + dateWithMinutes(endDate) : ''}${client_name_or_client_email ? '&client_name=' + client_name_or_client_email : ''}`,
    );
  }

  deleteClaim(ClaimId: number) {
    return axios.delete(CLAIM_URL + `/${ClaimId}`);
  }
}
