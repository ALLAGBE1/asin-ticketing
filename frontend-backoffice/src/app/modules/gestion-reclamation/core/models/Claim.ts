export class ClaimModel {
  id?: number;
  reference?: string;
  location_event?: string;
  date_event?: string;
  date_claim?: string;
  description?: string;
  expect?: string;
  amount?: number;
  is_reminder?: boolean;
  reception_channel_id?: number;
  response_channel_id?: number;
  currency_id?: number;
  agency_id?: number;
  status_id?: number;
  type_id?: number;
  institution_id?: number;
  object_id?: number;
  customer_id?: number;
  insurrance_type_id?: number;
  product_id?: number;
  product_name?:string;
  createAt?: string;
  updateAt?: string;
}
