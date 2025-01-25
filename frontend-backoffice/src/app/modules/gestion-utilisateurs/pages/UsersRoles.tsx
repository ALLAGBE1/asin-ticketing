/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG } from '../../../../_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';

import '../GestionUtilisateurs.css';

import { UserPermissionRequest } from '../core/services/userPermissionsRequest';
import { UserRolesRequest } from '../core/services/userRolesRequest';

import { UserRoleModel } from '../core/models/userRole';
import { UserPermissionModel } from '../core/models/userPermission';
import { useNavigate } from 'react-router-dom';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';

const UserRolesShema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Descrition is required'),
  //   permission_id: Yup.number()
  //   .required('Permission Level is required'),
});

const permissionRequest = new UserPermissionRequest();
const rolesRequest = new UserRolesRequest();

const UsersRoles: FC = () => {
  const intl = useIntl();

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

  const initialValues = new UserRoleModel();

  const toUpdateValue = new UserRoleModel();

  const [toDeleteValue, settoDeleteValue] = useState<UserRoleModel | any>();

  const [loading, setLoading] = useState(false);
  const [userRolesloader, setuserRolesloader] = useState(true);
  const [userRolesDeleteloader, setuserRolesDeleteloader] = useState(false);
  const [userRolesDatas, setuserRolesDatas] = useState(Array<UserRoleModel>);

  const [userPermissionDatas, setuserPermissionDatas] = useState(
    Array<UserPermissionModel>,
  );

  const navigate = useNavigate();

  const affectPermissions = (role: any) => {
    navigate('/users/affect-role/' + role.id);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: UserRolesShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await rolesRequest
        .addUserRole(values)
        .then((response: any) => {
          closeModal('modal_close-formik');
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateUserRole = useFormik({
    initialValues: toUpdateValue,
    validationSchema: UserRolesShema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await rolesRequest
        .updateUserRole(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateUserRole');
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: UserRoleModel | any) => {
    formikUpdateUserRole.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: UserRoleModel | any) => {
    settoDeleteValue(data);
  };

  const getUserRoles = async () => {
    setuserRolesloader(true);

    await rolesRequest
      .getUserRoleList()
      .then((response: any) => {
        setuserRolesDatas(response.data.items);
        setuserRolesloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUserPermissions = async () => {
    setuserRolesloader(true);

    await permissionRequest
      .getUserPermissionList()
      .then((response: any) => {
        setuserPermissionDatas(response.data.items);
        setuserRolesloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteUserRole = async () => {
    setuserRolesDeleteloader(true);

    await rolesRequest
      .deleteUserRole(toDeleteValue?.id)
      .then((response: any) => {
        getUserRoles();
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getUserRoles();
    // getUserPermissions();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'SETTINGS.USERS_ROLES' })}
      </PageTitle>

      {/* Add New User roles  modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ROLE.ROLE_ADDING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formik"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.NAME' })}
                    {...formik.getFieldProps('name')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid': formik.touched.name && formik.errors.name,
                      },
                      {
                        'is-valid': formik.touched.name && !formik.errors.name,
                      },
                    )}
                    type="text"
                    name="name"
                    autoComplete="on"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                  </label>

                  <textarea
                    placeholder={intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                    {...formik.getFieldProps('description')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.description &&
                          formik.errors.description,
                      },
                      {
                        'is-valid':
                          formik.touched.description &&
                          !formik.errors.description,
                      },
                    )}
                    name="description"
                  ></textarea>

                  {formik.touched.description && formik.errors.description && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.description}</span>
                    </div>
                  )}
                </div>

                {/* <div className='fv-row mb-8'>
                                        <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'SETTINGS.USERS_PERMISSIONS'})}</label>
                                        
                                        <select
                                              className={clsx(
                                                  'form-control bg-transparent',
                                                  {'is-invalid': formik.touched.permission_id && formik.errors.permission_id},
                                                  {
                                                  'is-valid': formik.touched.permission_id && !formik.errors.permission_id,
                                                  }
                                              )}
                                              data-control='select2'
                                              data-placeholder='Latest'
                                              data-hide-search='true'
                                              {...formik.getFieldProps('permission_id')}
                                          >
                                              <option>Veuillez selectionner les permissions</option>
  
                                              {userPermissionDatas?.map((row, index) => (
  
                                                  <option key={index} value={row.id}>{row.name}</option>
                                                      
                                              ))}
  
                                          </select>
  
                                        {formik.touched.permission_id && formik.errors.permission_id && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.permission_id}</span>
                                        </div>
                                        )}
                                    </div> */}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {loading && (
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

      {/* updating User roles modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateUserRole.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ROLE.ROLE_UPDATING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateUserRole"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.NAME' })}
                    {...formikUpdateUserRole.getFieldProps('name')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateUserRole.touched.name &&
                          formikUpdateUserRole.errors.name,
                      },
                      {
                        'is-valid':
                          formikUpdateUserRole.touched.name &&
                          !formikUpdateUserRole.errors.name,
                      },
                    )}
                    type="text"
                    name="name"
                    autoComplete="on"
                  />
                  {formikUpdateUserRole.touched.name &&
                    formikUpdateUserRole.errors.name && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateUserRole.errors.name}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                  </label>

                  <textarea
                    placeholder={intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                    {...formikUpdateUserRole.getFieldProps('description')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateUserRole.touched.description &&
                          formikUpdateUserRole.errors.description,
                      },
                      {
                        'is-valid':
                          formikUpdateUserRole.touched.description &&
                          !formikUpdateUserRole.errors.description,
                      },
                    )}
                    name="description"
                  ></textarea>

                  {formikUpdateUserRole.touched.description &&
                    formikUpdateUserRole.errors.description && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateUserRole.errors.description}
                        </span>
                      </div>
                    )}
                </div>

                {/* <div className='fv-row mb-8'>
                                        <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'SETTINGS.USERS_PERMISSIONS'})}</label>
                                        
                                        <select
                                              className={clsx(
                                                  'form-control bg-transparent',
                                                  {'is-invalid': formikUpdateUserRole.touched.permission_id && formikUpdateUserRole.errors.permission_id},
                                                  {
                                                  'is-valid': formikUpdateUserRole.touched.permission_id && !formikUpdateUserRole.errors.permission_id,
                                                  }
                                              )}
                                              data-control='select2'
                                              data-placeholder='Latest'
                                              data-hide-search='true'
                                              {...formikUpdateUserRole.getFieldProps('permission_id')}
                                          >
                                              <option>Veuillez selectionner les permissions</option>
  
                                              {userPermissionDatas?.map((row, index) => (
  
                                                  <option key={index} value={row.id}>{row.name}</option>
                                                      
                                              ))}
  
                                          </select>
  
                                        {formikUpdateUserRole.touched.permission_id && formikUpdateUserRole.errors.permission_id && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formikUpdateUserRole.errors.permission_id}</span>
                                        </div>
                                        )}
                                    </div> */}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formikUpdateUserRole.isSubmitting ||
                    !formikUpdateUserRole.isValid
                  }
                >
                  {!loading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {loading && (
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

      {/* delete role modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER_ROLE.ROLE_DELETING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-delete"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <div className="fv-row mb-8">
                  <h3 className="fw-bolder text-center col-12 mv-2rem">
                    {intl.formatMessage({
                      id: 'USER_ROLE.ROLE_WOULD_YOU_WANNA_DELETE',
                    })}{' '}
                    :{' '}
                    <span className="text-danger">{toDeleteValue?.name} </span>
                  </h3>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => deleteUserRole()}
                >
                  {!userRolesDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'USER_ROLE.ROLE_DELETE' })}
                    </span>
                  )}
                  {userRolesDeleteloader && (
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

      {/* User roles categories list */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {/* {intl.formatMessage({id: 'GEN.lIST_OF'})}
                            {intl.formatMessage({id: 'SETTINGS.COMPLAINT_CATEGORY'})} */}
                </span>
                {/* <span className='text-muted mt-1 fw-semibold fs-7'>{row.libelle}</span> */}
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigate('/users/new-role')}
                    >
                      {intl.formatMessage({ id: 'USER_ROLE.ROLE_ADD' })}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card-body py-3">
              <div className="">
                <div className="" id="">
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                      <thead>
                        <tr className="border-0">
                          <th className="p-0 w-50px fw-bolder text-left">N°</th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.NAME' })}
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.DESCRIPTION'})}</th> */}
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'SETTINGS.USERS_PERMISSIONS'})}</th> */}
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {userRolesDatas?.map((row, index) => (
                          <tr key={row.id}>
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.name}</h5>
                                <span>{row.description}</span>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                                <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                    <h5>{row.permission_id}</h5>
                                                </div>
                                            </td> */}

                            <td className=" text-left">
                              <a
                                onClick={() =>
                                  navigate('/users/update-role/' + row.id)
                                }
                                // data-bs-toggle="modal"
                                // data-bs-target="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'COMPLAINT.OBJECT_UPDATE',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-warning"
                              >
                                <KTIcon
                                  iconName="notepad-edit"
                                  className="fs-1"
                                />
                              </a>
                              {/* <a
                                                    href='javascript:void(0)' onClick={() => affectPermissions(row)} title='Affect Permission'
                                                    className='btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1'
                                                    data-bs-toggle='modal'
                                                    data-bs-target='#kt_modal_change_user_status'
                                                >
                                                    <KTIcon iconName='shield-search' className='fs-1' />
                                                </a> */}
                              <a
                                onClick={() => selectToDelete(row)}
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'COMPLAINT.OBJECT_DELETE',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-danger"
                              >
                                <KTIcon iconName="trash" className="fs-1" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {userRolesloader && userRolesDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!userRolesloader && userRolesDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                          🚫 {intl.formatMessage({ id: 'GEN.NO_DATAS' })}
                        </h3>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  {/* end::Table */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { UsersRoles };
