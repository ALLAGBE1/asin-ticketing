/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import {
  closeModal,
  getGenderAvatar,
  handleHttpError,
} from '../../../utils/functions';
import { UnityRequest } from '../../gestion-paramettres/core/services/UnityRequests';
import { UnityModel } from '../../gestion-paramettres/core/models/Unity';
import { InstitutionModel } from '../../gestion-paramettres/core/models/Institution';
import { InstitutionRequest } from '../../gestion-paramettres/core/services/InstitutionRequests';
import { useFormik } from 'formik';
import { UserAccountRequest } from '../core/services/userAccountRequest';
import {
  NewUserModel,
  Profil,
  UserAccountModel,
} from '../core/models/userAccount';
import * as Yup from 'yup';
import clsx from 'clsx';
import { UserRolesRequest } from '../core/services/userRolesRequest';
import { UserRoleModel } from '../core/models/userRole';
import { AdminUserAccountRequest } from '../core/services/adminUserAccountRequest';
import { UserModel } from '../../auth';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { useNavigate } from 'react-router-dom';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { LinearProgress, TablePagination } from '@mui/material';
import { ProfileRequest } from '../../gestion-profile/core/services/ProfileRequests';
import { IsAHolding } from '../../../utils/permissionAccessHandler';

import PhoneInput from 'react-country-phone-input'
import 'react-country-phone-input/lib/style.css'

const userAccountSchema = Yup.object().shape({
  role_id: Yup.number().required('Role is required'),
  username: Yup.string().min(4).required('Username is required'),
  nom: Yup.string().required('Nom is required'),
  job: Yup.string().required('Job is required'),
  // institution_id: Yup.string()
  //   .required('Institution is required'),
  unity_id: Yup.string().required('unity is required'),
  is_lead: Yup.string(),
  prenom: Yup.string().required('Prenom is required'),
  sexe: Yup.string().required('Sexe is required'),
  ville: Yup.string().required('Ville is required'),
  telephone: Yup.string().required('Telephone is required'),
  email: Yup.string()
    // .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'format : exemple@gmail.com')
    .required('Email is required')
    .email('Email format not valid'),
  //@ts-ignore
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Minimum 8 caractères')
    //@ts-ignore
    .matches('^(?=.*[a-z])', 'minimum 01 lettre minuscule')
    //@ts-ignore
    .matches('^(?=.*[A-Z])', 'minimum 01 lettre majuscule')
    //@ts-ignore
    .matches('^(?=.*[0-9])', 'minimum 01 chiffre')
    .matches(
      //@ts-ignore
      '^(?=.*[@$!%*?&])',
      'minimum 01 caractère spécial compris entre : "@$!%*?&"',
    ),
  //@ts-ignore
  confirmePassword: Yup.string()
    .required('Password is required')
    .min(8, 'Minimum 8 caractères')
    //@ts-ignore
    .matches('^(?=.*[a-z])', 'minimum 01 lettre minuscule')
    //@ts-ignore
    .matches('^(?=.*[A-Z])', 'minimum 01 lettre majuscule')
    //@ts-ignore
    .matches('^(?=.*[0-9])', 'minimum 01 chiffre')
    .matches(
      //@ts-ignore
      '^(?=.*[@$!%*?&])',
      'minimum 01 caractère spécial compris entre : "@$!%*?&"',
    ),
});

const userAccountForUpdateUserDataSchema = Yup.object().shape({
  username: Yup.string().min(4).max(30).required('Username is required'),
  nom: Yup.string().required('Nom is required'),
  job: Yup.string().required('Job is required'),
  unity_id: Yup.string(),
  is_lead: Yup.string(),
  prenom: Yup.string().required('Prenom is required'),
  sexe: Yup.string().required('Sexe is required'),
  ville: Yup.string().required('Ville is required'),
  telephone: Yup.string().required('Telephone is required'),
  email: Yup.string()
    // .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'format : exemple@gmail.com')
    .required('Email is required')
    .email('Email format not valid'),
});

const changePasswordFormSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(6, 'Minimum 6 caractères')
    .required('Le nouveau mot de passe est requis'),
  confirm_password: Yup.string()
    .min(6, 'Minimum 6 caractères')
    .required('Confirmation de passe est requis'),
});

const formikAddUserANewRoleShema = Yup.object().shape({
  role_id: Yup.number(),
});

const formikRemoveRoleFromUserShema = Yup.object().shape({
  role_id: Yup.number().required('Role required'),
});

const formikChangeUserStatusShema = Yup.object().shape({
  status: Yup.number().required('Status required'),
});

const changePasswordFormValue = {
  new_password: '',
  confirm_password: '',
};

const changeUserStatusInitialVal = { status: 0 };

const unityRequest = new UnityRequest();
const institutionRequest = new InstitutionRequest();
const userRolesRequest = new UserRolesRequest();
const userAccountRequest = new UserAccountRequest();
const adminUsersAccountRequest = new AdminUserAccountRequest();
const profileRequests = new ProfileRequest();

const UserList: FC = () => {
  const intl = useIntl();

  const USERDATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const USERDATAS = JSON.parse(localStorage.getItem(USERDATAS_KEY));

  const userConectedInstitutionId = USERDATAS.unity.institution.id;

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'MANAGEMENT.USERS' }),
      path: '/users/list',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ];

  // const initialValues = new UserAccountModel();

  const initialValues = new NewUserModel();

  // let toUpdateValue = new NewUserModel();
  const [toUpdateValue, settoUpdateValue] = useState<any>(new NewUserModel());

  const affectData = { role_id: 1 };
  const removeRoleData = { role_id: null };

  const [toDeleteValue, settoDeleteValue] = useState<any>(
    new UserAccountModel(),
  );
  const [toAffectRole, settoAffectRole] = useState<UnityModel | any>();
  const [userToUpdate_id, setUserToUpdate_id] = useState<number | any>();

  const [errorMsg, setErrorMsg] = useState<any>('');
  const [selectedRoleId, setselectedRoleId] = useState<any>();

  const [usersBulkImporterFile, setusersBulkImporterFile] = useState<any>();
  const [userImportLoader, setuserImportLoader] = useState<any>(false);

  const [affectRoleLoader, setaffectRoleLoader] = useState<any>(false);

  const [gettingUnitiesLoader, setgettingUnitiesLoader] = useState<any>(0); // 0: Initial State, 1: Datas loading, 2: After datas loading

  const [addingUserAccountloader, setAddingUserAccountloader] =
    useState<any>(false);
  const [userAccountIsCreated, setUserAccountIsCreated] = useState<any>(false);
  const [userAccountDatasloader, setuserAccountDatasloader] =
    useState<any>(true);
  const [showPassword, setShowPassword] = useState<any>(false);

  const [unityDatas, setUnityDatas] = useState<any>(Array<UnityModel>);
  const [institutionDatas, setinstitutionDatas] = useState<any>(
    Array<InstitutionModel>,
  );
  const [userRolesDatas, setuserRolesDatas] = useState<any>(
    Array<UserRoleModel>,
  );
  const [userAccountsDatas, setuserAccountsDatas] = useState<any>(
    Array<UserAccountModel>,
  );
  const [adminUserAccountsDatas, setadminUserAccountsDatas] = useState<any>(
    Array<any>,
  );

  const [ref, setref] = useState('');

  const [userRoleList, setUserRoleList] = useState<any>(Array<any>);
  const [gettingUserRolesLoader, setGettingUserRolesLoader] =
    useState<any>(true);

  const [newUserData, setNewUserData] = useState<any>();

  const [filteredRole, setfilteredRole] = useState<any>(1);
  const [filteredInstitution, setfilteredInstitution] = useState<any>(
    IsAHolding() ? null : userConectedInstitutionId,
  );
  const [filteredUserState, setfilteredUserState] = useState<any>();

  const navigate = useNavigate();

  const [page, setpage] = useState(1);
  const [rowsPerPageSize, setRowsPerPage] = useState(50);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
  const [totalItems, settotalItems] = useState(0);

  const changeUserRoleFilter = (event: any) => {
    console.log(event.target.value);

    const role_id = event.target.value;
    setfilteredRole(role_id);
    getUserAccounts(role_id, filteredInstitution);
  };

  const changeInstitutionFilter = (event: any) => {
    console.log(event.target.value);

    const institution_id = event.target.value;
    setfilteredInstitution(institution_id);
    getUserAccounts(filteredRole, institution_id);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: userAccountSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setAddingUserAccountloader(true);

      // console.log(values);
      setNewUserData(values);

      const _data = {
        profile: {
          first_name: values.prenom,
          last_name: values.nom,
          sex: values.sexe,
          city: values.ville,
          address: '',
          department: '',
          telephone: values.telephone,
          email: values.email,
        },
        user: {
          username: values.username,
          email: values.email,
          password: values.password,
          fonction: values.job,
          is_lead: values.is_lead == '1' ? true : false,
        },
      };

      let unity_id = values.unity_id;

      // console.log(_data);

      //@ts-ignore
      await userAccountRequest
        .addNewUser(_data, unity_id)
        .then((response: any) => {
          setUserAccountIsCreated(true);
          setSubmitting(false);
          setAddingUserAccountloader(false);
          formik.resetForm();
          notificationSuccessToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.ADDED_SUCCESS' }),
          );
          getUserAccounts();

          if (values.role_id) {
            console.log(response.data.id, values.role_id);
            linkRoleToUser(response.data.id, values.role_id);
          }
        })
        .catch((error: any) => {
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.ADDED_ERROR' }),
          );
          setSubmitting(false);
          setAddingUserAccountloader(false);
        });
    },
  });

  const formikUpdateUser = useFormik({
    initialValues: toUpdateValue,
    validationSchema: userAccountForUpdateUserDataSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setAddingUserAccountloader(true);

      console.log(values);

      const update_values = {
        first_name: values.prenom,
        last_name: values.nom,
        sex: values.sexe,
        city: values.ville,
        telephone: values.telephone,
        email: values.email,
      };

      // console.log(update_values, userToUpdate_id, values.unity_id, values.job)

      //@ts-ignore
      await userAccountRequest
        .updateUserDatas(
          update_values,
          userToUpdate_id,
          values.unity_id,
          values.job,
        )
        .then((response: any) => {
          closeModal('modal_close-formikUpdateUser');
          setSubmitting(false);
          setAddingUserAccountloader(false);
          formikUpdateUser.resetForm();
          getUserAccounts();

          setUserToUpdate_id(null);
          settoUpdateValue(null);
        })
        .catch((error: any) => {
          handleHttpError(error);
          setSubmitting(false);
          setAddingUserAccountloader(false);
        });
    },
  });

  const formikAddUserANewRole = useFormik({
    initialValues: affectData,
    validationSchema: formikAddUserANewRoleShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setaffectRoleLoader(true);

      //@ts-ignore
      await userRolesRequest
        .affectRoleToUser(toAffectRole.id, values.role_id)
        .then((response: any) => {
          closeModal('modal_close-formikAddUserANewRole');
          setaffectRoleLoader(false);
          formikAddUserANewRole.resetForm();
          getUserAccounts();
          notificationSuccessToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.LINKED_TO_ROLE_SUCCESS' }),
          );
        })
        .catch((error: any) => {
          handleHttpError(error);
          setStatus(false);
          setSubmitting(false);
          setaffectRoleLoader(false);
          notificationErrorToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.LINKED_TO_ROLE_ERROR' }),
          );
        });
    },
  });

  const formikRemoveRolefromUser = useFormik({
    initialValues: removeRoleData,
    validationSchema: formikRemoveRoleFromUserShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setaffectRoleLoader(true);

      //@ts-ignore
      await userRolesRequest
        .unLinkRoleFromUser(values.role_id, toAffectRole.id)
        .then((response: any) => {
          closeModal('modal_close-formikRemoveRolefromUser');
          setaffectRoleLoader(false);
          formikRemoveRolefromUser.resetForm();
          getUserAccounts();
          notificationSuccessToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.REMOVE_ROLE_SUCCESS' }),
          );
        })
        .catch((error: any) => {
          handleHttpError(error);
          setStatus(false);
          setSubmitting(false);
          setaffectRoleLoader(false);
          notificationErrorToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.REMOVE_ROLE_ERROR' }),
          );
        });
    },
  });

  const formikChangeUserStatus = useFormik({
    initialValues: changeUserStatusInitialVal,
    validationSchema: formikChangeUserStatusShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      console.log(toAffectRole);
      console.log(values);

      setSubmitting(true);

      if (values.status != 0) {
        //@ts-ignore
        await profileRequests
          .activateUser(toAffectRole.id)
          .then((response: any) => {
            closeModal('modal_close-formikChangeUserStatus');
            formikChangeUserStatus.resetForm();
            getUserAccounts();
            notificationSuccessToast(
              intl.formatMessage({ id: 'USER_ACCOUNT.USER_ACTIVATED_SUCCESS' }),
            );
          })
          .catch((error: any) => {
            handleHttpError(error);
            setStatus(false);
            setSubmitting(false);
            notificationErrorToast(
              intl.formatMessage({ id: 'USER_ACCOUNT.USER_ACTIVATED_ERROR' }),
            );
          });
      } else {
        //@ts-ignore
        await profileRequests
          .deactivateUser(toAffectRole.id)
          .then((response: any) => {
            closeModal('modal_close-formikChangeUserStatus');
            formikChangeUserStatus.resetForm();
            notificationSuccessToast(
              intl.formatMessage({
                id: 'USER_ACCOUNT.USER_DEACTIVATED_SUCCESS',
              }),
            );
          })
          .catch((error: any) => {
            handleHttpError(error);
            setStatus(false);
            setSubmitting(false);
            notificationErrorToast(
              intl.formatMessage({ id: 'USER_ACCOUNT.USER_DEACTIVATED_ERROR' }),
            );
          });
      }
    },
  });

  const formkikChangePassword = useFormik({
    initialValues: changePasswordFormValue,
    validationSchema: changePasswordFormSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      console.log(values);
      console.log(toAffectRole.id);

      // @ts-ignore
      await profileRequests
        .reInitUserPassword(toAffectRole.id, values.new_password)
        .then((response: any) => {
          setStatus(false);
          setSubmitting(false);
          closeModal('modal_close-formkikChangePassword');
          formkikChangePassword.resetForm();
          notificationSuccessToast(
            intl.formatMessage({
              id: 'USER_ACCOUNT.USER_PASSWORD_UPDATED_SUCCESS',
            }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({
              id: 'USER_ACCOUNT.USER_PASSWORD_UPDATED_ERROR',
            }),
            5000,
          );
        });
    },
  });

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    setusersBulkImporterFile(file);
    console.log(file);
  };

  const submitUploadFile = async () => {
    setuserImportLoader(true);

    await userAccountRequest
      .addNewUsersBulk(usersBulkImporterFile)
      .then((response: any) => {
        closeModal('modal_close-formikUploadFile');
        // notificationSuccessToast(intl.formatMessage({id: 'USER_ACCOUNT.LINKED_TO_ROLE_SUCCESS'}))
      })
      .catch((error: any) => {
        handleHttpError(error);
        setuserImportLoader(false);
      });
  };

  const chooseInstitution = async (event: any) => {
    console.log(event.target.value);

    setgettingUnitiesLoader(1);

    const institutionId = event.target.value;

    getUnitiesListByInstitutionId(institutionId);
  };

  const linkRoleToUser = async (userId: number, roleId: any) => {
    await userRolesRequest
      .affectRoleToUser(userId, roleId)
      .then((response: any) => {
        getUserAccounts();
        notificationSuccessToast(
          intl.formatMessage({ id: 'USER_ACCOUNT.LINKED_TO_ROLE_SUCCESS' }),
        );
      })
      .catch((error: any) => {
        handleHttpError(error);
        notificationErrorToast(
          intl.formatMessage({ id: 'USER_ACCOUNT.LINKED_TO_ROLE_ERROR' }),
        );
      });
  };

  const selectToDelete = (data: UnityModel | any) => {
    settoDeleteValue(data);
  };

  const getUnitiesListByInstitutionId = async (institutionId: number) => {
    setgettingUnitiesLoader(1);

    await unityRequest
      .getUnityListByInstitutionId(institutionId)
      .then((response: any) => {
        console.log(response.data);
        setUnityDatas(response.data);
        setgettingUnitiesLoader(2);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUnitiesList = async () => {
    setgettingUnitiesLoader(1);

    await unityRequest
      .getUnityList()
      .then((response: any) => {
        setUnityDatas(response.data.items);
        setgettingUnitiesLoader(2);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUserRolesList = async () => {
    await userRolesRequest
      .getUserRoleList()
      .then((response: any) => {
        setuserRolesDatas(response.data.items);
        console.log(response.data.items);
        setGettingUserRolesLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUsersFilteredByNameAndEmail = async (_ref: string) => {

    console.log(_ref)
    setuserAccountDatasloader(true);
    setref(_ref);

    await adminUsersAccountRequest
      .getFilteredUser(
        IsAHolding() ? filteredInstitution : null,
        filteredUserState,
        filteredRole,
        page,
        rowsPerPageSize,
        _ref,
        _ref
      )
      .then((response: any) => {
        console.log(response.data.items);
        setadminUserAccountsDatas(response.data.items);
        setuserAccountDatasloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUserAccounts = async (
    role_id = filteredRole,
    institution_id = filteredInstitution,
  ) => {
    setuserAccountDatasloader(true);

    await adminUsersAccountRequest
      .getFilteredUser(
        IsAHolding() ? institution_id : null,
        filteredUserState,
        role_id,
        page,
        rowsPerPageSize,
        ref,ref
      )
      .then((response: any) => {
        console.log(response.data.items);
        setadminUserAccountsDatas(response.data.items);
        setuserAccountDatasloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // const handleChangeRowsPerPage = async (event: any) => {
  //   setuserAccountDatasloader(true);

  //   const rowsPerPageSize = parseInt(event.target.value, 10);
  //   setRowsPerPage(rowsPerPageSize);
  //   setpage(1);

  //   await logRequests
  //     .getUsersLoginLogs(page, rowsPerPageSize, user_datas.unity.institution.id)
  //     .then((response: any) => {
  //       setuserLoginLogsDatas(response.data.items);
  //       setuserAccountDatasloader(false);
  //     })
  //     .catch((error: any) => {
  //       handleHttpError(error);
  //     });
  // };

  // const changePages = async (event: any, value: any) => {
  //   console.log(value);

  //   setuserAccountDatasloader(true);
  //   setpage(value);

  //   await logRequests
  //     .getUsersLoginLogs(value, rowsPerPageSize, user_datas.unity.institution.id)
  //     .then((response: any) => {
  //       setuserLoginLogsDatas(response.data.items);
  //       setuserAccountDatasloader(false);
  //     })
  //     .catch((error: any) => {
  //       handleHttpError(error);
  //     });
  // };

  const getInstitutionList = async () => {
    await institutionRequest
      .getInstitutionList()
      .then((response: any) => {
        setinstitutionDatas(
          response.data.items.filter(
            (e: any) => e.institution_type.libelle != 'HOLDING',
          ),
        );
        console.log(institutionDatas);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const selectUser = (data: UserModel | any) => {
    settoAffectRole(data);
  };

  const cancel = () => {
    settoAffectRole(new NewUserModel());
  };

  const selectUsertoRemoveItsRole = async (data: UserModel | any) => {
    settoAffectRole(data);
    setGettingUserRolesLoader(true);

    await userRolesRequest
      .getUserRoleByUserId(data.id)
      .then((response: any) => {
        setUserRoleList(response.data.roles);
        setGettingUserRolesLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const selectToUpdateValue = (data: UserModel | any) => {
    console.log(data);

    const _data = {
      username: data.username,
      nom: data.profile.last_name,
      prenom: data.profile.first_name,
      sexe: data.profile.sex,
      ville: data.profile.city,
      telephone: data.profile.telephone,
      email: data.profile.email,
      job: data.fonction,
      unity_id: data.unity?.id,
    };

    console.log(_data);
    // toUpdateValue = _data;
    setUserToUpdate_id(data.id);
    settoUpdateValue(_data);
    formikUpdateUser.setValues(_data);
  };

  useEffect(() => {
    getUserAccounts();
    getInstitutionList();
    getUserRolesList();

    if (IsAHolding()) {
      // getUnitiesList();
    } else {
      getUnitiesList();
    }
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'USER_ACCOUNT.LIST' })}
      </PageTitle>

      {/* new user modal */}
      <div
        className="modal fade"
        id="kt_modal_new_user"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-950px">
          <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header pb-0 border-0 justify-content-end">
                <div
                  className="btn btn-sm btn-icon btn-active-color-primary"
                  id="modal_close-formik"
                  data-bs-dismiss="modal"
                >
                  <KTIcon iconName="cross" className="fs-1" />
                </div>
              </div>

              <div className="modal-body scroll-y mx-5 mx-xl-18 pt-0 pb-15">
                <div className=" mb-13">
                  <h2 className="mb-3">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.ADDING' })}
                  </h2>
                </div>

                {userAccountIsCreated ? (
                  <div className="row">
                    <div className="col-12 fv-row mb-8 d-flex">
                      <img
                        src={toAbsoluteUrl(`media/gifs/message.gif`)}
                        style={{ maxWidth: '19rem', margin: '0 auto' }}
                        alt=""
                      />
                    </div>

                    <div className="col-12 fv-row mb-8 d-flex">
                      <h3 className="text-center">
                        {intl.formatMessage({
                          id: 'USER_ACCOUNT.MESSAGE_AFTER_SUCCESS_OF_ADDING_ACCOUNT',
                        })}
                      </h3>
                    </div>

                    <div className="col-12 fv-row mb-8 d-flex">
                      <h3 className="text-center d-flex">
                        <span className="text-danger">
                          {intl.formatMessage({ id: 'AUTH.INPUT.EMAIL' })} :{' '}
                        </span>
                        <h3 className="ml-3 mr-3"> {newUserData.email} </h3>
                      </h3>
                    </div>

                    <div className="col-12 fv-row mb-8 d-flex">
                      <h3 className="text-center d-flex">
                        <span className="text-danger">
                          {intl.formatMessage({ id: 'GEN.PASSWORD' })} :{' '}
                        </span>
                        <h3
                          className="ml-3 mr-3"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? newUserData.password : '************'}
                          <i
                            className="fas fa-exclamation-circle ms-2 fs-7"
                            data-bs-toggle="tooltip"
                            title="Click to show password"
                          ></i>
                        </h3>
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.USERNAME' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({
                          id: 'USER.USERNAME',
                        })}
                        {...formik.getFieldProps('username')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.username && formik.errors.username,
                          },
                          {
                            'is-valid':
                              formik.touched.username &&
                              !formik.errors.username,
                          },
                        )}
                        type="text"
                        name="username"
                        autoComplete="on"
                      />
                      {formik.touched.username && formik.errors.username && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.username}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER_ACCOUNT.JOB_TITLE' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({
                          id: 'USER_ACCOUNT.JOB_TITLE',
                        })}
                        {...formik.getFieldProps('job')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.job && formik.errors.job,
                          },
                          {
                            'is-valid':
                              formik.touched.job && !formik.errors.job,
                          },
                        )}
                        type="text"
                        name="job"
                        autoComplete="on"
                      />
                      {formik.touched.job && formik.errors.job && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.job}</span>
                        </div>
                      )}
                    </div>

                    <div className="separator separator-dashed my-5"></div>

                    <div className="col-4 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.INSTITUTION' })}
                      </label>

                      <select
                        className={clsx('form-control bg-transparent')}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formik.getFieldProps('institution_id')}
                        onChange={() => chooseInstitution(event)}
                      >
                        <option>Veuillez selectionner l'institution</option>

                        {institutionDatas?.map((row: any, index: number) => (
                          <option key={index} value={row.id}>
                            {row.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-4 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.UNITY' })}
                      </label>

                      {gettingUnitiesLoader == 1 && <LOADER_INPUTLOADER />}

                      {(gettingUnitiesLoader == 2 ||
                        gettingUnitiesLoader == 0) && (
                        <>
                          <select
                            className={clsx(
                              'form-control bg-transparent',
                              {
                                'is-invalid':
                                  formik.touched.unity_id &&
                                  formik.errors.unity_id,
                              },
                              {
                                'is-valid':
                                  formik.touched.unity_id &&
                                  !formik.errors.unity_id,
                              },
                            )}
                            data-control="select2"
                            data-placeholder="Latest"
                            data-hide-search="true"
                            {...formik.getFieldProps('unity_id')}
                          >
                            <option>Veuillez selectionner l'unité</option>

                            {unityDatas?.map((row: any, index: number) => (
                              <option key={index} value={row.id}>
                                {row.libelle}
                              </option>
                            ))}
                          </select>

                          {formik.touched.unity_id &&
                            formik.errors.unity_id && (
                              <div className="fv-plugins-message-container">
                                <span role="alert">
                                  {formik.errors.unity_id}
                                </span>
                              </div>
                            )}
                        </>
                      )}
                    </div>

                    <div className="col-4 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.IS_LEAD' })}
                      </label>

                      <select
                        className={clsx('form-control bg-transparent')}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formik.getFieldProps('is_lead')}
                      >
                        <option value={2} selected>
                          {intl.formatMessage({ id: 'GEN.NO' })}
                        </option>
                        <option value={1}>
                          {intl.formatMessage({ id: 'GEN.YES' })}
                        </option>
                      </select>
                    </div>

                    <div className="separator separator-dashed my-5"></div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({
                          id: 'USER.FIRSTNAME',
                        })}
                        {...formik.getFieldProps('prenom')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.prenom && formik.errors.prenom,
                          },
                          {
                            'is-valid':
                              formik.touched.prenom && !formik.errors.prenom,
                          },
                        )}
                        type="text"
                        name="prenom"
                        autoComplete="on"
                      />
                      {formik.touched.prenom && formik.errors.prenom && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.prenom}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.LASTNAME' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({
                          id: 'USER.LASTNAME',
                        })}
                        {...formik.getFieldProps('nom')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.nom && formik.errors.nom,
                          },
                          {
                            'is-valid':
                              formik.touched.nom && !formik.errors.nom,
                          },
                        )}
                        type="text"
                        name="nom"
                        autoComplete="on"
                      />
                      {formik.touched.nom && formik.errors.nom && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.nom}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.SEXE' })}
                      </label>

                      <select
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.sexe && formik.errors.sexe,
                          },
                          {
                            'is-valid':
                              formik.touched.sexe && !formik.errors.sexe,
                          },
                        )}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formik.getFieldProps('sexe')}
                      >
                        <option>Veuillez selectionner le genre</option>
                        <option value={'M'}>
                          {intl.formatMessage({ id: 'GEN.MALE' })}
                        </option>
                        <option value={'F'}>
                          {intl.formatMessage({ id: 'GEN.FEMALE' })}
                        </option>
                      </select>

                      {formik.touched.sexe && formik.errors.sexe && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.sexe}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.CITY' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({ id: 'USER.CITY' })}
                        {...formik.getFieldProps('ville')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.ville && formik.errors.ville,
                          },
                          {
                            'is-valid':
                              formik.touched.ville && !formik.errors.ville,
                          },
                        )}
                        type="text"
                        name="ville"
                        autoComplete="on"
                      />
                      {formik.touched.ville && formik.errors.ville && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.ville}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">


                    <PhoneInput
                      country={'ci'}
                        // name="telephone"
                      // value={this.state.phone}
                      // onChange={phone => this.setState({ phone })}
                    />

                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.PHONE' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({ id: 'USER.PHONE' })}
                        {...formik.getFieldProps('telephone')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.telephone &&
                              formik.errors.telephone,
                          },
                          {
                            'is-valid':
                              formik.touched.telephone &&
                              !formik.errors.telephone,
                          },
                        )}
                        type="tel"
                        name="telephone"
                        autoComplete="on"
                      />
                      {formik.touched.telephone && formik.errors.telephone && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.telephone}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'USER.EMAIL' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({ id: 'USER.EMAIL' })}
                        {...formik.getFieldProps('email')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.email && formik.errors.email,
                          },
                          {
                            'is-valid':
                              formik.touched.email && !formik.errors.email,
                          },
                        )}
                        type="email"
                        name="email"
                        autoComplete="on"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{formik.errors.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="separator separator-dashed my-5"></div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.PASSWORD' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({ id: 'GEN.PASSWORD' })}
                        {...formik.getFieldProps('password')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.password && formik.errors.password,
                          },
                          {
                            'is-valid':
                              formik.touched.password &&
                              !formik.errors.password,
                          },
                        )}
                        type="password"
                        name="password"
                        autoComplete="on"
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="fv-plugins-message-container text-danger">
                          <span role="alert">{formik.errors.password}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.CONFIRM_PASSWORD' })}
                      </label>
                      <input
                        placeholder={intl.formatMessage({
                          id: 'GEN.CONFIRM_PASSWORD',
                        })}
                        {...formik.getFieldProps('confirmePassword')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formik.touched.confirmePassword &&
                              formik.errors.confirmePassword,
                          },
                          {
                            'is-valid':
                              formik.touched.confirmePassword &&
                              !formik.errors.confirmePassword,
                          },
                        )}
                        type="password"
                        name="confirmePassword"
                        autoComplete="on"
                      />
                      {formik.touched.confirmePassword &&
                        formik.errors.confirmePassword && (
                          <div className="fv-plugins-message-container text-danger">
                            <span role="alert">
                              {formik.errors.confirmePassword}
                            </span>
                          </div>
                        )}
                      {formik.values.password !=
                        formik.values.confirmePassword && (
                        <div className="fv-plugins-message-container text-danger">
                          <span role="alert"> Mot de passe incorrecte </span>
                        </div>
                      )}
                    </div>

                    <div className="separator separator-dashed my-5"></div>

                    <div className="col-12 mb-7 row">
                      <label className="required fw-bold fs-6 mb-5">Role</label>

                      {userRolesDatas?.map((row: any, index: number) => (
                        <>
                          <div key={index} className="col-6 fv-row mb-8">
                            <div className="form-check form-check-custom form-check-solid">
                              <input
                                className="form-check-input me-3"
                                {...formik.getFieldProps('role_id')}
                                name="role_id"
                                type="radio"
                                value={row.id}
                                id={`kt_modal_update_role_option_${index}`}
                              />

                              <label
                                className="form-check-label"
                                htmlFor={`kt_modal_update_role_option_${index}`}
                              >
                                <div className="fw-bolder text-gray-800">
                                  {row.name}
                                </div>
                                <div className="text-gray-600">
                                  {row.description}
                                </div>
                              </label>
                            </div>
                          </div>
                        </>
                      ))}

                      {formik.touched.role_id && formik.errors.role_id && (
                        <div className="fv-plugins-message-container text-danger">
                          <span role="alert">{formik.errors.role_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <h3 className="col-12 text-danger text-center">
                  {errorMsg ? errorMsg : ''}
                </h3>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setUserAccountIsCreated(false)}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CLOSE' })}
                </button>

                {!userAccountIsCreated && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formik.isValid}
                    onClick={() => formik.submitForm()}
                  >
                    {!addingUserAccountloader && (
                      <span className="indicator-label">
                        {intl.formatMessage({
                          id: 'AUTH.GENERAL.SUBMIT_BUTTON',
                        })}
                      </span>
                    )}
                    {addingUserAccountloader && (
                      <span
                        className="indicator-progress"
                        style={{ display: 'block' }}
                      >
                        {intl.formatMessage({ id: 'GEN.WAIT' })}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* new user modal end */}

      {/* updating user modal */}
      <div
        className="modal fade"
        id="kt_modal_update_user"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-850px">
          <form
            className="form w-100"
            onSubmit={formikUpdateUser.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header pb-0 border-0 justify-content-end">
                <div
                  className="btn btn-sm btn-icon btn-active-color-primary"
                  id="modal_close-formikUpdateUser"
                  data-bs-dismiss="modal"
                >
                  <KTIcon iconName="cross" className="fs-1" />
                </div>
              </div>

              <div className="modal-body scroll-y mx-5 mx-xl-18 pt-0 pb-15">
                <div className=" mb-13">
                  <h2 className="mb-3">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.UPDATING' })}
                  </h2>
                </div>

                <div className="row">
                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.USERNAME' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.USERNAME' })}
                      {...formikUpdateUser.getFieldProps('username')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.username &&
                            formikUpdateUser.errors.username,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.username &&
                            !formikUpdateUser.errors.username,
                        },
                      )}
                      type="text"
                      name="username"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.username &&
                      formikUpdateUser.errors.username && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.username}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER_ACCOUNT.JOB_TITLE' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({
                        id: 'USER_ACCOUNT.JOB_TITLE',
                      })}
                      {...formikUpdateUser.getFieldProps('job')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.job &&
                            formikUpdateUser.errors.job,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.job &&
                            !formikUpdateUser.errors.job,
                        },
                      )}
                      type="text"
                      name="job"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.job &&
                      formikUpdateUser.errors.job && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.job}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="separator separator-dashed my-5"></div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'GEN.INSTITUTION' })}
                    </label>

                    <select
                      className={clsx('form-control bg-transparent')}
                      data-control="select2"
                      data-placeholder="Latest"
                      data-hide-search="true"
                      {...formikUpdateUser.getFieldProps('institution_id')}
                      onChange={() => chooseInstitution(event)}
                    >
                      <option>Veuillez selectionner l'institution</option>

                      {institutionDatas?.map((row: any, index: number) => (
                        <option key={index} value={row.id}>
                          {row.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'GEN.UNITY' })}
                    </label>

                    {gettingUnitiesLoader == 1 && <LOADER_INPUTLOADER />}

                    {(gettingUnitiesLoader == 2 ||
                      gettingUnitiesLoader == 0) && (
                      <>
                        <select
                          className={clsx('form-control bg-transparent')}
                          data-control="select2"
                          data-placeholder="Latest"
                          data-hide-search="true"
                          {...formikUpdateUser.getFieldProps('unity_id')}
                        >
                          <option>Veuillez selectionner l'unité</option>

                          {unityDatas?.map((row: any, index: number) => (
                            <option key={index} value={row.id}>
                              {row.libelle}
                            </option>
                          ))}
                        </select>

                        {formikUpdateUser.touched.unity_id &&
                          formikUpdateUser.errors.unity_id && (
                            <div className="fv-plugins-message-container">
                              <span role="alert">
                                {formikUpdateUser.errors.unity_id}
                              </span>
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  <div className="separator separator-dashed my-5"></div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                      {...formikUpdateUser.getFieldProps('prenom')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.prenom &&
                            formikUpdateUser.errors.prenom,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.prenom &&
                            !formikUpdateUser.errors.prenom,
                        },
                      )}
                      type="text"
                      name="prenom"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.prenom &&
                      formikUpdateUser.errors.prenom && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.prenom}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.LASTNAME' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.LASTNAME' })}
                      {...formikUpdateUser.getFieldProps('nom')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.nom &&
                            formikUpdateUser.errors.nom,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.nom &&
                            !formikUpdateUser.errors.nom,
                        },
                      )}
                      type="text"
                      name="nom"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.nom &&
                      formikUpdateUser.errors.nom && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.nom}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.SEXE' })}
                    </label>

                    <select
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.sexe &&
                            formikUpdateUser.errors.sexe,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.sexe &&
                            !formikUpdateUser.errors.sexe,
                        },
                      )}
                      data-control="select2"
                      data-placeholder="Latest"
                      data-hide-search="true"
                      {...formikUpdateUser.getFieldProps('sexe')}
                    >
                      <option>Veuillez selectionner le genre</option>
                      <option value={'M'}>
                        {intl.formatMessage({ id: 'GEN.MALE' })}
                      </option>
                      <option value={'F'}>
                        {intl.formatMessage({ id: 'GEN.FEMALE' })}
                      </option>
                    </select>

                    {formikUpdateUser.touched.sexe &&
                      formikUpdateUser.errors.sexe && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.sexe}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.CITY' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.CITY' })}
                      {...formikUpdateUser.getFieldProps('ville')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.ville &&
                            formikUpdateUser.errors.ville,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.ville &&
                            !formikUpdateUser.errors.ville,
                        },
                      )}
                      type="text"
                      name="ville"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.ville &&
                      formikUpdateUser.errors.ville && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.ville}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.PHONE' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.PHONE' })}
                      {...formikUpdateUser.getFieldProps('telephone')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.telephone &&
                            formikUpdateUser.errors.telephone,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.telephone &&
                            !formikUpdateUser.errors.telephone,
                        },
                      )}
                      type="tel"
                      name="telephone"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.telephone &&
                      formikUpdateUser.errors.telephone && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.telephone}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-6 fv-row mb-8">
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'USER.EMAIL' })}
                    </label>
                    <input
                      placeholder={intl.formatMessage({ id: 'USER.EMAIL' })}
                      {...formikUpdateUser.getFieldProps('email')}
                      className={clsx(
                        'form-control bg-transparent',
                        {
                          'is-invalid':
                            formikUpdateUser.touched.email &&
                            formikUpdateUser.errors.email,
                        },
                        {
                          'is-valid':
                            formikUpdateUser.touched.email &&
                            !formikUpdateUser.errors.email,
                        },
                      )}
                      type="email"
                      name="email"
                      autoComplete="on"
                    />
                    {formikUpdateUser.touched.email &&
                      formikUpdateUser.errors.email && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formikUpdateUser.errors.email}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => formikUpdateUser.submitForm()}
                >
                  {!addingUserAccountloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {addingUserAccountloader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* updating user modal end */}

      {/* affect new role modal */}
      <div
        className="modal fade"
        id="kt_modal_affect_new_role_to_user"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-500px">
          <form
            className="form w-100"
            onSubmit={formikAddUserANewRole.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ACCOUNT.AFFECT_NEW_ROLE' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  id="modal_close-formikAddUserANewRole"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <h4 className="text-center" style={{ marginBottom: '3rem' }}>
                  {intl.formatMessage({
                    id: 'USER_ACCOUNT.AFFECTING_NEW_ROLE_TO',
                  })}
                  <strong className="text-danger">
                    {toAffectRole?.profile?.email}
                  </strong>
                </h4>

                <div className="col-12 mb-7">
                  <label className="required fw-bold fs-6 mb-5">Role</label>

                  {userRolesDatas?.map((row: any, index: number) => (
                    <>
                      <div key={index} className="d-flex fv-row mb-2">
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input me-3"
                            {...formikAddUserANewRole.getFieldProps('role_id')}
                            name="role_id"
                            type="radio"
                            value={row.id}
                            id={`kt_modal_affect_new_role_option_${index}`}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={`kt_modal_affect_new_role_option_${index}`}
                          >
                            <div className="fw-bolder text-gray-800">
                              {row.name}
                            </div>
                            <div className="text-gray-600">
                              {row.description}
                            </div>
                          </label>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => formikAddUserANewRole.submitForm()}
                >
                  {!affectRoleLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'USER_ACCOUNT.AFFECT' })}
                    </span>
                  )}
                  {affectRoleLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* affect new role modal end */}

      {/* remove role modal */}
      <div
        className="modal fade"
        id="kt_modal_remove_role_to_user"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-600px">
          <form
            className="form w-100"
            onSubmit={formikRemoveRolefromUser.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ACCOUNT.REMOVE_ROLE' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  id="modal_close-formikRemoveRolefromUser"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <h4 className="text-center" style={{ marginBottom: '3rem' }}>
                  {intl.formatMessage({
                    id: 'USER_ACCOUNT.REMOVE_NEW_ROLE_TO',
                  })}
                  <strong className="text-danger">
                    {toAffectRole?.profile?.email}
                  </strong>
                </h4>

                <div className="col-12 mb-7">
                  <label className="fw-bold fs-6 mb-5">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.AFFECTED_ROLES' })}
                  </label>

                  <div className="row">
                    {gettingUserRolesLoader ? (
                      <>
                        <div className="d-flex fv-row mb-2 col-12">
                          <LOADER_INPUTLOADER />
                        </div>
                        <div className="d-flex fv-row mb-2 col-12">
                          <LOADER_INPUTLOADER />
                        </div>
                      </>
                    ) : (
                      <>
                        {userRoleList?.map((row: any, index: number) => (
                          <>
                            <div
                              key={index}
                              className="d-flex fv-row mb-2 col-12"
                            >
                              <div className="form-check form-check-custom form-check-solid">
                                <label
                                  className="form-check-label"
                                  htmlFor={`kt_modal_affect_new_role_option_${index}`}
                                >
                                  <div className="fw-bolder text-gray-800">
                                    {row.name}
                                  </div>
                                  <div className="text-gray-600">
                                    {row.description}
                                  </div>
                                </label>
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="col-12 mb-7">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.ROLE_TO_REMOVE' })}
                  </label>

                  {gettingUserRolesLoader ? (
                    <>
                      <div className="d-flex fv-row mb-2 col-12">
                        <LOADER_INPUTLOADER />
                      </div>
                    </>
                  ) : (
                    <>
                      <select
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formikRemoveRolefromUser.touched.role_id &&
                              formikRemoveRolefromUser.errors.role_id,
                          },
                          {
                            'is-valid':
                              formikRemoveRolefromUser.touched.role_id &&
                              !formikRemoveRolefromUser.errors.role_id,
                          },
                        )}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formikRemoveRolefromUser.getFieldProps('role_id')}
                      >
                        <option>
                          {intl.formatMessage({
                            id: 'USER_ACCOUNT.CHOOSE_ROLE_TO_REMOVE',
                          })}
                        </option>

                        {userRoleList?.map((row: any, index: number) => (
                          <option key={index} value={row.id}>
                            {row.name}
                          </option>
                        ))}
                      </select>

                      {formikRemoveRolefromUser.touched.role_id &&
                        formikRemoveRolefromUser.errors.role_id && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">
                              {formikRemoveRolefromUser.errors.role_id}
                            </span>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => formikRemoveRolefromUser.submitForm()}
                >
                  {!affectRoleLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.REMOVE' })}
                    </span>
                  )}
                  {affectRoleLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* remove role modal end */}

      {/* switch user status modal */}
      <div
        className="modal fade"
        id="kt_modal_change_user_status"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-500px">
          <form
            className="form w-100"
            onSubmit={formikChangeUserStatus.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ACCOUNT.CHANGE_STATUS' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  id="modal_close-formikChangeUserStatus"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <h4 className="text-center" style={{ marginBottom: '3rem' }}>
                  {intl.formatMessage({ id: 'USER_ACCOUNT.CHANGE_STATUS_TO' })}
                  <strong className="text-danger">
                    {toAffectRole?.profile?.email}
                  </strong>
                </h4>

                <div className="col-12 mb-7">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.STATUS' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikChangeUserStatus.touched.status &&
                          formikChangeUserStatus.errors.status,
                      },
                      {
                        'is-valid':
                          formikChangeUserStatus.touched.status &&
                          !formikChangeUserStatus.errors.status,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikChangeUserStatus.getFieldProps('status')}
                  >
                    <option value={0}>
                      {intl.formatMessage({ id: 'GEN.DEACTIVATE' })}
                    </option>
                    <option value={1}>
                      {intl.formatMessage({ id: 'GEN.ACTIVATE' })}
                    </option>
                  </select>

                  {formikChangeUserStatus.touched.status &&
                    formikChangeUserStatus.errors.status && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikChangeUserStatus.errors.status}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => formikChangeUserStatus.submitForm()}
                >
                  {!formikChangeUserStatus.isSubmitting && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.SUBMIT' })}
                    </span>
                  )}
                  {formikChangeUserStatus.isSubmitting && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* switch user status modal end */}

      {/* add multiple user by uploading modal */}
      <div className="modal fade" id="kt_modal_upload_users_file" tabIndex={-1}>
        <div className="modal-dialog mw-600px">
          <form className="form w-100" noValidate>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ACCOUNT.IMPORT_USER_DATAS' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  id="modal_close-formikUploadFile"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <div className="col-12 mb-7">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.SELECT_FILE' })}
                  </label>

                  <input
                    className={clsx(
                      'form-control bg-transparent',
                      { 'is-invalid': !usersBulkImporterFile },
                      {
                        'is-valid': usersBulkImporterFile,
                      },
                    )}
                    onChange={onFileChange}
                    type="file"
                    accept=".xlsx, .csv"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => submitUploadFile()}
                >
                  {!userImportLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.IMPORT' })}
                    </span>
                  )}
                  {userImportLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* add multiple user by uploading modal end */}

      {/* update user password  modal */}
      <div
        className="modal fade"
        id="kt_modal_change_user_password"
        tabIndex={-1}
      >
        <div className="modal-dialog mw-500px">
          <form
            className="form w-100"
            onSubmit={formkikChangePassword.handleSubmit}
            noValidate
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ACCOUNT.REINIT_PASSWORD' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  id="modal_close-formkikChangePassword"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body row p-10">
                <div className="col-12 mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'USER.NEW_PASSWORD' })}
                  </label>

                  <input
                    placeholder={intl.formatMessage({
                      id: 'USER.NEW_PASSWORD',
                    })}
                    {...formkikChangePassword.getFieldProps('new_password')}
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikChangePassword.touched.new_password &&
                          formkikChangePassword.errors.new_password,
                      },
                      {
                        'is-valid':
                          formkikChangePassword.touched.new_password &&
                          !formkikChangePassword.errors.new_password,
                      },
                    )}
                    type="password"
                    name="new_password"
                    autoComplete="on"
                  />

                  {formkikChangePassword.touched.new_password &&
                    formkikChangePassword.errors.new_password && (
                      <div className="fv-plugins-message-container">
                        <span className="text-danger" role="alert">
                          {formkikChangePassword.errors.new_password}
                        </span>
                      </div>
                    )}
                </div>

                <div className="col-12 mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'USER.CONFIRM_PASSWORD' })}
                  </label>

                  <input
                    placeholder={intl.formatMessage({
                      id: 'USER.CONFIRM_PASSWORD',
                    })}
                    {...formkikChangePassword.getFieldProps('confirm_password')}
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikChangePassword.touched.confirm_password &&
                          formkikChangePassword.errors.confirm_password,
                      },
                      {
                        'is-valid':
                          formkikChangePassword.touched.confirm_password &&
                          !formkikChangePassword.errors.confirm_password,
                      },
                    )}
                    type="password"
                    name="confirm_password"
                    autoComplete="on"
                  />

                  {formkikChangePassword.touched.confirm_password &&
                    formkikChangePassword.errors.confirm_password && (
                      <div className="fv-plugins-message-container">
                        <span className="text-danger" role="alert">
                          {formkikChangePassword.errors.confirm_password}
                        </span>
                      </div>
                    )}

                  {formkikChangePassword.values.new_password !=
                    formkikChangePassword.values.confirm_password && (
                    <div className="fv-plugins-message-container">
                      <span className="text-danger" role="alert">
                        {intl.formatMessage({ id: 'USER.DEFERENT_PASSWORD' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => cancel()}
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => formkikChangePassword.submitForm()}
                  disabled={
                    formkikChangePassword.values.new_password !=
                      formkikChangePassword.values.confirm_password ||
                    !formkikChangePassword.isValid
                  }
                >
                  {!formkikChangePassword.isSubmitting && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.SUBMIT' })}
                    </span>
                  )}
                  {formkikChangePassword.isSubmitting && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* update user password  modal end */}

      <div className={`card mb-5 mb-xl-8`}>
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            {/* begin::Search */}
            <div className="d-flex align-items-center position-relative my-1">
              <KTIcon
                iconName="magnifier"
                className="fs-1 position-absolute ms-6"
              />
              <input
                type="text"
                value={ref}
                onChange={(e) => getUsersFilteredByNameAndEmail(e.target.value)}
                data-kt-user-table-filter="search"
                className="form-control bg-transparent w-300px ps-14"
                placeholder={'Recherche...'}
              />
            </div>
            {/* end::Search */}
          </div>

          {/* begin::Card toolbar */}
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              {gettingUserRolesLoader ? (
                <LOADER_INPUTLOADER />
              ) : (
                <>
                  {IsAHolding() && (
                    <select
                      className="col-2 form-control w-auto bg-transparent me-3"
                      data-control="select2"
                      data-placeholder="Latest"
                      data-hide-search="true"
                      value={filteredInstitution}
                      onChange={() => changeInstitutionFilter(event)}
                    >
                      <option value={''}>
                        {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                          intl.formatMessage({
                            id: 'SETTINGS.INSTITUTION',
                          })}
                      </option>
                      {institutionDatas?.map((row: any, index: number) => (
                        <option key={index} value={row.id}>
                          {row.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* begin::Filter users by role */}
                  <select
                    className="col-2 form-control w-auto bg-transparent me-3"
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    value={filteredRole}
                    onChange={() => changeUserRoleFilter(event)}
                  >
                    {userRolesDatas?.map((row: any, index: number) => (
                      <option key={index} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                  </select>

                  {/* begin::Import users */}
                  <button
                    type="button"
                    className="col-4 btn btn-sm btn-light-primary me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_upload_users_file"
                    // onClick={()=> newClaim()}
                  >
                    <KTIcon iconName="file-up" className="fs-2" />
                    {intl.formatMessage({ id: 'GEN.IMPORT' })}{' '}
                    {intl.formatMessage({ id: 'GEN.USER' })}
                  </button>
                  {/* end::Import users */}

                  {/* begin::Add user */}
                  <button
                    type="button"
                    className="col-4 btn btn-sm btn-light-primary me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_new_user"
                    // onClick={()=> newClaim()}
                  >
                    <KTIcon iconName="plus" className="fs-2" />
                    {intl.formatMessage({ id: 'USER_ACCOUNT.ADD' })}
                  </button>
                  {/* end::Add user */}
                </>
              )}
            </div>
          </div>
        </div>

        {/* begin::Body */}
        <div className="card-body py-3">
          {/* begin::Table container */}
          <div className="table-responsive">
            {userAccountDatasloader && <LinearProgress color="primary" />}

            {/* begin::Table */}
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              {/* begin::Table head */}
              <thead>
                <tr className="fw-bold text-muted">
                  {/* <th className='w-25px'>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              value='1'
                              data-kt-check='true'
                              data-kt-check-target='.widget-9-check'
                            />
                          </div>
                        </th> */}
                  <th className="min-w-250px">User</th>
                  <th className="min-w-140px">Role</th>

                  {IsAHolding() && <th className="min-w-140px">Filiale</th>}

                  {/*  
                  <th className="min-w-120px">Dernière connexion</th>
                  <th className="min-w-100px">Auth2</th>*/}
                  <th className="min-w-100px">Statut</th>
                  <th className="min-w-100px">Progression</th>
                  <th className="min-w-100px text-end">Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {adminUserAccountsDatas?.map((row: any, index: number) => (
                  <>
                    <tr key={index}>
                      {/* <td>
                                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                      <input className='form-check-input widget-9-check' type='checkbox' value='1' />
                                    </div>
                                  </td> */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-45px me-5">
                            <img
                              src={getGenderAvatar(row.profile?.sex)}
                              alt=""
                            />
                          </div>
                          <div className="d-flex justify-content-start flex-column">
                            <a className="text-gray-900 fw-bold text-hover-primary fs-6">
                              {row.profile?.first_name} {row.profile?.last_name}
                            </a>
                            <span className="text-muted fw-semibold text-muted d-block fs-16">
                              <a
                                href={
                                  row.profile?.email
                                    ? 'mailto:' + row.profile?.email
                                    : '#'
                                }
                              >
                                {row.profile?.email ? row.profile?.email : ''}
                              </a>
                            </span>
                            <span className="text-muted fw-semibold text-muted d-block fs-16">
                              <a
                                href={
                                  row.profile?.telephone
                                    ? 'tel:' + row.profile?.telephone
                                    : '#'
                                }
                              >
                                {row.profile?.telephone
                                  ? row.profile?.telephone
                                  : ''}
                              </a>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                          {row.fonction ? row.fonction : '--'}
                        </a>
                        <span className="text-muted fw-semibold text-muted d-block fs-7">
                          {row.roles?.map((role: any, index: any) => (
                            <>
                              {index > 0 ? ';' : ''} {role.name}
                            </>
                          ))}
                          {/* Role de gestion complete de tout les instances */}
                        </span>
                      </td>

                      {IsAHolding() && (
                        <td>
                          <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                            {row.unity?.institution
                              ? row.unity?.institution.name
                              : '--'}
                          </a>
                        </td>
                      )}

                      {/* <td>
                        <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                          il y a 2 jours 
                          --
                        </a>
                      </td>
                      <td>
                        <span className="badge badge-light-success">
                          Active 
                          --
                        </span>
                      </td>*/}
                      <td>
                        <span
                          className={clsx(
                            'badge',
                            { 'badge-light-success': row.is_active },
                            {
                              'badge-light-danger': !row.is_active,
                            },
                          )}
                        >
                          {row.is_active
                            ? intl.formatMessage({ id: 'GEN.ACTIVATED' })
                            : intl.formatMessage({ id: 'GEN.DEACTIVATED' })}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex flex-column w-100 me-2">
                          <div className="d-flex flex-stack mb-2">
                            <span className="text-muted me-2 fs-7 fw-semibold">
                              0%
                            </span>
                          </div>
                          <div className="progress h-6px w-100">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end flex-shrink-0">
                          <a
                            href="javascript:void(0)"
                            onClick={() => selectUser(row)}
                            title="Affect Role"
                            className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_affect_new_role_to_user"
                          >
                            <KTIcon iconName="shield-search" className="fs-1" />
                          </a>
                          <a
                            href="javascript:void(0)"
                            onClick={() => selectUsertoRemoveItsRole(row)}
                            title="Remove role from user"
                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_remove_role_to_user"
                          >
                            <KTIcon iconName="eraser" className="fs-1" />
                          </a>
                          <a
                            href="javascript:void(0)"
                            onClick={() => selectUser(row)}
                            title="Change user status"
                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_change_user_status"
                          >
                            <KTIcon iconName="switch" className="fs-1" />
                          </a>
                          <a
                            href="javascript:void(0)"
                            onClick={() => selectToUpdateValue(row)}
                            title="Update user"
                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_update_user"
                          >
                            <KTIcon iconName="pencil" className="fs-1" />
                          </a>
                          <a
                            href="javascript:void(0)"
                            onClick={() => settoAffectRole(row)}
                            title="reinit user password"
                            className="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_change_user_password"
                          >
                            <KTIcon
                              iconName="password-check"
                              className="fs-1"
                            />
                          </a>
                          <a
                            href={'/users/details/' + row?.id}
                            className="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
                          >
                            <KTIcon iconName="eye" className="fs-1" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}

            <div className="row">
              {userAccountDatasloader && adminUserAccountsDatas.length == 0 ? (
                <h3 className="fw-bolder text-center col-12 mv-2rem">
                  {intl.formatMessage({ id: 'GEN.LOADING' })}
                </h3>
              ) : (
                ''
              )}

              {!userAccountDatasloader && adminUserAccountsDatas.length == 0 ? (
                <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                  🚫 {intl.formatMessage({ id: 'GEN.NO_DATAS' })}
                </h3>
              ) : (
                ''
              )}
            </div>
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </>
  );
};

export { UserList };
