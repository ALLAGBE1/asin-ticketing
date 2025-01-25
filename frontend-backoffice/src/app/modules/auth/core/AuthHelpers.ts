/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModel, UserModel } from './_models';

// const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'

const _ENV = import.meta.env;
const VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY =
  _ENV.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY;
const VITE_SATIS_APP_USER_DATAS_LOCAL_STORAGE_ACCESS_KEY =
  _ENV.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(
    VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY,
  );
  if (!lsValue) {
    return;
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel;
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const getUserData = (): UserModel | undefined => {
  if (!localStorage) {
    return;
  }

  const userDatasValue: string | null = localStorage.getItem(
    VITE_SATIS_APP_USER_DATAS_LOCAL_STORAGE_ACCESS_KEY,
  );
  if (!userDatasValue) {
    return;
  }

  try {
    const _user: UserModel = JSON.parse(userDatasValue) as UserModel;
    if (_user) {
      // You can easily check auth_token expiration also
      return _user;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY, lsValue);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

const setUserData = (user: UserModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const userDatasValue = JSON.stringify(user);
    localStorage.setItem(
      VITE_SATIS_APP_USER_DATAS_LOCAL_STORAGE_ACCESS_KEY,
      userDatasValue,
    );
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const removeUser = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(VITE_SATIS_APP_USER_DATAS_LOCAL_STORAGE_ACCESS_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';

  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();
      if (auth && auth.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
        // config.headers.Authorization = `${auth.token_type} ${auth.access_token}`
      }

      return config;
    },
    (err: any) => Promise.reject(err),
  );
}

export {
  getAuth,
  getUserData,
  setAuth,
  setUserData,
  removeAuth,
  removeUser,
  VITE_SATIS_APP_AUTH_LOCAL_STORAGE_ACCESS_KEY,
  VITE_SATIS_APP_USER_DATAS_LOCAL_STORAGE_ACCESS_KEY,
};
