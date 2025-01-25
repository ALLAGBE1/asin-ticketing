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
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { handleHttpError } from '../../../utils/functions';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';

const UserRolesShema = Yup.object().shape({
  name: Yup.string().min(4, 'Minimum 4 letters').required('Name is required'),
  description: Yup.string().required('Descrition is required'),
});

const permissionRequest = new UserPermissionRequest();
const rolesRequest = new UserRolesRequest();

const UsersRoleNew: FC = () => {
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

  const [gettingPermissionDatasLoader, setGettingPermissionDatasLoader] =
    useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [rolesPermissionsDatas, setRolesPermissionsDatas] = useState(
    Array<any>,
  );

  const [userPermissionDatas, setuserPermissionDatas] = useState(Array<any>);

  const navigate = useNavigate();

  const backToRolesList = () => {
    navigate('/users/roles');
  };

  const formik = useFormik({
    initialValues,
    validationSchema: UserRolesShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      const role = {
        role: {
          name: values.name,
          description: values.description,
        },
        permissions_ids: rolesPermissionsDatas,
      };

      console.log(role);

      await rolesRequest
        .addRoleWithItsPermissions(role)
        .then((response: any) => {
          backToRolesList();
          console.log(response);
          notificationSuccessToast('Role is created successfully');
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const setRolePermissionList = (permission_id: number) => {
    if (!rolesPermissionsDatas.includes(permission_id)) {
      const _rolesPermissionsDatas = [
        ...rolesPermissionsDatas,
        ...[permission_id],
      ];
      setRolesPermissionsDatas(_rolesPermissionsDatas);
    } else {
      const _rolesPermissionsDatas = [...rolesPermissionsDatas].filter(
        (id: any) => id != permission_id,
      );
      setRolesPermissionsDatas(_rolesPermissionsDatas);
    }

    console.log(rolesPermissionsDatas);
  };

  const getUserPermissions = async () => {
    setGettingPermissionDatasLoader(true);

    await permissionRequest
      .getUserPermissionList()
      .then((response: any) => {
        console.log(response.data);
        setuserPermissionDatas(response.data);
        setGettingPermissionDatasLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    // getUserRoles();
    getUserPermissions();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'USER_ROLE.ROLE_ADD' })}
      </PageTitle>

      <div className="col-xxl-12">
        <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
          <div className="card-body py-3">
            <form
              className="form w-100"
              onSubmit={formik.handleSubmit}
              noValidate
              id="kt_login_signin_form"
            >
              <div className="row">
                <div className="col-6 fv-row mb-8">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.NAME' })}
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

                <div className="separator separator-dashed my-5"></div>

                <div className="col-6 fv-row mb-8">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                  </label>
                  <textarea
                    cols={20}
                    rows={5}
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
                    autoComplete="on"
                  ></textarea>
                  {formik.touched.description && formik.errors.description && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.description}</span>
                    </div>
                  )}
                </div>

                <div className="separator separator-dashed my-5"></div>

                <div className="col-12 fv-row mb-8">
                  <label className="required form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'ROLE.PERMISSIONS' })}
                  </label>

                  {gettingPermissionDatasLoader ? (
                    <div className="row m-5">
                      <div className="col-4 fv-row mb-8">
                        <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                      </div>

                      <div className="col-4 fv-row mb-8">
                        <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                      </div>

                      <div className="col-4 fv-row mb-8">
                        <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                      </div>
                    </div>
                  ) : (
                    <div className="row m-5">
                      {userPermissionDatas?.map((row, index) => (
                        <>
                          <div className='col-12'>
                            <h4 className='mb-5'>{row.resource_name}</h4>
                            <div className="row mb-8">
                              {row.permissions?.map((_row:any, _index:number) => (
                                <>
                                <div key={_index} className="col-6 fv-row mb-8">
                                  <div className="form-check form-check-custom form-check-solid">
                                    <input
                                      className="form-check-input me-3"
                                      type="checkbox"
                                      value={_row.id}
                                      multiple
                                      onChange={(event: any) =>
                                        setRolePermissionList(
                                          parseInt(event.target.value),
                                        )
                                      }
                                      id={`permission_select_${index}`}
                                    />
  
                                    <label
                                      className="form-check-label"
                                      htmlFor={`permission_select_${index}`}
                                    >
                                      <div className="fw-bolder text-gray-800">
                                        {_row.scope_fr}
                                      </div>
                                      <div className="text-gray-600">
                                        {_row.description}
                                      </div>
                                    </label>
                                  </div>
                                </div>
                                </>
                              ))}
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer mb-5">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => backToRolesList()}
            >
              {intl.formatMessage({ id: 'GEN.CANCEL' })}
            </button>

            <a
              type="submit"
              className="btn btn-primary"
              onClick={() => formik.submitForm()}
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
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export { UsersRoleNew };
