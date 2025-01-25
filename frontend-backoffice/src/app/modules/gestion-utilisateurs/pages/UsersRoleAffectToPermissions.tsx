/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';

import '../GestionUtilisateurs.css';

import { UserPermissionRequest } from '../core/services/userPermissionsRequest';
import { UserRolesRequest } from '../core/services/userRolesRequest';

import { UserRoleModel } from '../core/models/userRole';
import { UserPermissionModel } from '../core/models/userPermission';
import { useParams } from 'react-router-dom';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import {
  UpperStr,
  closeModal,
  handleHttpError,
} from '../../../utils/functions';

const UserRolesShema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Descrition is required'),
  permission_id: Yup.number().required('Permission Level is required'),
});

const permissionRequest = new UserPermissionRequest();
const rolesRequest = new UserRolesRequest();

const UsersRoleAffectToPermissions: FC = () => {
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

  const roleId: any = useParams()['role_id'];

  const [role, setRole] = useState(new UserRoleModel());

  const [loading, setLoading] = useState(false);
  const [userRolesloader, setuserRolesloader] = useState(true);
  const [userRolesDatas, setuserRolesDatas] = useState(Array<any>);

  const [userPermissionDatas, setuserPermissionDatas] = useState(Array<any>);

  const formik = useFormik({
    initialValues,
    validationSchema: UserRolesShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await rolesRequest
        .addUserRole(values)
        .then((response: any) => {
          closeModal();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const getRoleById = async () => {
    setuserRolesloader(true);

    await rolesRequest
      .getUserRoleById(roleId)
      .then((response: any) => {
        setRole(response.data);
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

  useEffect(() => {
    getRoleById();
    getUserPermissions();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'USER_ACCOUNT.AFFECT_PERMISSION' })}
      </PageTitle>

      {/* User roles categories list */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          {!userRolesloader && (
            <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
              <div className="card-body py-3">
                <div className="">
                  <form
                    className="form w-100 row"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    id="kt_login_signin_form"
                  >
                    <div className="col-7 fv-row mt-5 mb-10">
                      <div className="symbol symbol-45px me-2 text-hover-primary">
                        <h3> {role?.name} </h3>
                        <span className="fs-4"> {role?.description} </span>
                      </div>
                    </div>

                    <div className="fv-row mb-8">
                      <label className="required form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({
                          id: 'SETTINGS.USERS_PERMISSIONS',
                        })}
                      </label>

                      <div className="row m-5">
                        {userPermissionDatas?.map((row, index) => (
                          <>
                            <label
                              key={row.id}
                              className="col-4 form-check form-check-sm form-check-custom form-check-solid mt-5 mb-5"
                            >
                              <input
                                className="form-check-input m-4"
                                type="checkbox"
                                value={row.id}
                              />

                              <div className="symbol-45px me-2 text-hover-primary d-block">
                                <span className="form-check-label text-dark fw-bolder">
                                  {UpperStr(row.scope)},{' '}
                                </span>
                                <span className="form-check-label">
                                  {row.description}
                                </span>
                              </div>
                            </label>
                          </>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card-footer py-3">
                <h5 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold fs-3 mb-1">
                    {/* {intl.formatMessage({id: 'GEN.lIST_OF'})}
                                    {intl.formatMessage({id: 'SETTINGS.COMPLAINT_CATEGORY'})} */}
                  </span>
                  {/* <span className='text-muted mt-1 fw-semibold fs-7'>{row.libelle}</span> */}
                </h5>

                <div className="card-toolbar">
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
                        {intl.formatMessage({
                          id: 'AUTH.GENERAL.SUBMIT_BUTTON',
                        })}
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

                  {/* <ul className='nav'>
                                    <li className='nav-item'>
                                        <button type="button"
                                            className="btn btn-primary"
                                            onClick={() => newRole()}
                                            >
                                            {intl.formatMessage({id: 'USER_ROLE.ROLE_ADD'})}
                                        </button>
                                    </li>
                                </ul> */}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            {userRolesloader ? (
              <h3 className="fw-bolder text-center col-12 mv-2rem">
                {intl.formatMessage({ id: 'GEN.LOADING' })}
              </h3>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { UsersRoleAffectToPermissions };
