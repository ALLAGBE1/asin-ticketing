/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { FC, useState, useEffect, createContext, useContext } from 'react';
// import {FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction} from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core';
import { AuthModel, UserModel } from './_models';
import * as authHelper from './AuthHelpers';
// import {getUserByToken} from './_requests'
import { WithChildren } from '../../../../_metronic/helpers';
import { UserAccountRequest } from '../../gestion-utilisateurs/core/services/userAccountRequest';
import { UserRolesRequest } from '../../gestion-utilisateurs/core/services/userRolesRequest';
import { handleHttpError } from '../../../utils/functions';
import { UserPermissionRequest } from '../../gestion-utilisateurs/core/services/userPermissionsRequest';
// import { useNavigate } from 'react-router-dom'

const userDataRequest = new UserAccountRequest();
const userRoleRequest = new UserRolesRequest();
const userPermissionRequest = new UserPermissionRequest();

const ROLE_KEY = import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_ROLE;
const PERMISSIONS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_ROLE_PERMISSION;

type AuthContextProps = {
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  // setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  setCurrentUser: (user: UserModel | undefined) => void;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: authHelper.getUserData(),
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, _setCurrentUser] = useState<UserModel | undefined>(
    authHelper.getUserData(),
  );

  // const navigate = useNavigate();

  // const goToLogin = () => {
  //   navigate('/auth');
  // }

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const setCurrentUser = (user: UserModel | undefined) => {
    _setCurrentUser(user);
    console.log(user);
    if (user) {
      authHelper.setUserData(user);
    } else {
      authHelper.removeUser();
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);

    // setTimeout(() => {
    //   goToLogin()
    // }, 2000);
  };

  return (
    <AuthContext.Provider
      value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        const { data } = await userDataRequest.getCurrentUserDatas();
        console.log(data);
        if (data) {
          setCurrentUser(data);
          getUserRole(data.id);
        }
      } catch (error) {
        handleHttpError(error);
        console.error(error);
        if (currentUser) {
          logout();
        }
      } finally {
        setShowSplashScreen(false);
      }
    };

    const getUserRole = async (userId: number) => {
      await userRoleRequest
        .getUserRoleByUserId(userId)
        .then((res: any) => {
          const role = res.data.roles[0];
          console.log(role);
          getUserRolePermissionss(role.id);
          localStorage.setItem(ROLE_KEY, JSON.stringify(role));
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    };

    const getUserRolePermissionss = async (roleId: number) => {
      await userPermissionRequest
        .getUserPermissionListByRoleID(roleId)
        .then((res: any) => {
          console.log(res.data);
          const permission = res.data.permissions;
          localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permission));
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    };

    if (auth && auth.access_token) {
      //@ts-ignore
      // getUserRole(currentUser.id);
      // console.log("currentUser")
      requestUser();
    } else {
      logout();
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
