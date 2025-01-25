export class CustomerModel {
  id?: number;
  profile?: Profile;
  account_number?: string;
  customer_type_id?: number;
  createAt?: string;
  updateAt?: string;
}

export type Profile = {
  last_name?: string;
  first_name?: string;
  sex?: string;
  city?: string;
  telephone?: string;
  email?: string;
};

export class CustomerModelCustom {
  first_name?: string;
  last_name?: string;
  sex?: string;
  address?: string;
  city?: string;
  department?: string;
  telephone?: string;
  email?: string;
  account_number?: string;
  company_name?: string;
  ifu?: string;
  location?: string;
}
