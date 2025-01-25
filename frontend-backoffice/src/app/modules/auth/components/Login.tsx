/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
// import {getUserByToken, login} from '../core/_requests'
// import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth';
import { useIntl } from 'react-intl';
import { AuthRequests } from '../core/services/AuthRequests';
import { UserAccountRequest } from '../../gestion-utilisateurs/core/services/userAccountRequest';
import { handleHttpError } from '../../../utils/functions';
import { UserRolesRequest } from '../../gestion-utilisateurs/core/services/userRolesRequest';
import { UserPermissionRequest } from '../../gestion-utilisateurs/core/services/userPermissionsRequest';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
});

// const initialValues = {
//   email: 'tossouvincent07@gmail.com',
//   password: '123456789',
// }

const initialValues = {
  email: 'admin@dmdsatis.com',
  password: 'dmdsatis24',
};

// const initialValues = {
//   email: 'admin@demo.com',
//   password: 'demo',
// }

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

const authRequest = new AuthRequests();
const userDataRequest = new UserAccountRequest();
const userRoleRequest = new UserRolesRequest();
const userPermissionRequest = new UserPermissionRequest();

const ROLE_KEY = import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_ROLE;
const PERMISSIONS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_ROLE_PERMISSION;

export function Login() {

  const [loading, setLoading] = useState(false);
  const [isUserActive, setisUserActive] = useState(true);
  const { saveAuth, setCurrentUser } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setSubmitting(true);

      await authRequest
        .login(values.email, values.password)
        .then(async (response: any) => {
          saveAuth(response.data);

          await userDataRequest
            .getCurrentUserDatas()
            .then((response: any) => {
              console.log(response.data);
              setCurrentUser(response.data);
              getUserRole(response.data.id);
              // goToDashboard();
              // location.reload();
            })
            .catch((error: any) => {
              handleHttpError(error);

              // when the user is inactive
              if (error.response.data.detail == 'Inactive user') {
                setisUserActive(false);
                setSubmitting(false);
                setLoading(false);
              }
            });
        })
        .catch((error: any) => {
          console.log(error);
          if (!error.response.data.detail) {
            setError(error.message);
          }
          else {
            setError(error.response.data.detail);
          }
          setStatus('The login details are incorrect');
          setSubmitting(false);
          setLoading(false);
          handleHttpError(error);
        });
    },
  });

  const getUserRole = async (userId: number) => {
    await userRoleRequest
      .getUserRoleByUserId(userId)
      .then((res: any) => {
        const role = res.data.roles[0];
        // console.log(role)
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
        const permission = res.data.permissions;
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permission));
        location.reload();
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const intl = useIntl();

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">
          {intl.formatMessage({ id: 'AUTH.LOGIN.BUTTON' })}
        </h1>
        {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
      </div>
      {/* begin::Heading */}

      {/* <div className='row g-3 mb-9'>

        <div className='col-md-6'>

          <a
            href='#'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')}
              className='h-15px me-3'
            />
            Sign in with Google
          </a>

        </div>
        
        <div className='col-md-6'>

          <a
            href='#'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')}
              className='theme-light-show h-15px me-3'
            />
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')}
              className='theme-dark-show h-15px me-3'
            />
            Sign in with Apple
          </a>

        </div>

      </div> */}

      {/* <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div>

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>
            Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
            continue.
          </div>
        </div>
      )} */}

      {isUserActive ? (
        <>
          {/* begin::Form group */}
          <div className="fv-row mb-8">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'AUTH.INPUT.EMAIL' })}
            </label>
            <input
              placeholder={intl.formatMessage({ id: 'AUTH.INPUT.EMAIL' })}
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                },
              )}
              type="email"
              name="email"
              autoComplete="off"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className="fv-row mb-3">
            <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
              {intl.formatMessage({ id: 'AUTH.INPUT.PASSWORD' })}
            </label>
            <input
              type="password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid':
                    formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid':
                    formik.touched.password && !formik.errors.password,
                },
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Wrapper */}
          <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
            <div />

            {/* begin::Link */}
            <Link to="/auth/forgot-password" className="link-primary">
              {intl.formatMessage({ id: 'AUTH.FORGOT.TITLE' })}
            </Link>
            {/* end::Link */}
          </div>
          {/* end::Wrapper */}

          <h4 className="text-center text-danger mb-5">
            { error }
          </h4>

          {/* begin::Action */}
          <div className="d-grid mb-10">
            <button
              type="submit"
              id="kt_sign_in_submit"
              className="btn btn-primary btn-active-secondary btn-active-color-white"
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
          {/* end::Action */}
        </>
      ) : (
        <>
          <h2 className="text-center">
            {intl.formatMessage({ id: 'AUTH.LOGIN.INVALID_USER_MSG_1' })}
            <br></br>
            <br></br>
            {intl.formatMessage({ id: 'AUTH.LOGIN.INVALID_USER_MSG_2' })}
            <br></br>
            <br></br>
            {intl.formatMessage({ id: 'GEN.THANKS' })}
          </h2>
        </>
      )}

      {/* <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div> */}
    </form>
  );
}
