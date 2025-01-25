export class UserAccountModel {
  id?: number;
  addressMailPro?: string;
  password?: string;
  confirmePassword?: string;
  job?: string;
  roles_id?: number;
  unity_id?: number;
  institution_id?: number;
  person = {
    nom: '',
    prenom: '',
    sexe: '',
    ville: '',
    telephone: '',
    email: '',
  };
}

export class NewUserModel {
  id?: number;
  nom?: string;
  prenom?: string;
  username?: string;
  sexe?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  password?: string;
  confirmePassword?: string;
  job?: string;
  role_id?: number;
  unity_id?: number;
}

export class Profil {
  id?: number;
  nom?: string;
  prenom?: string;
  sexe?: string;
  ville?: string;
  telephone?: string;
  email?: string;
}
