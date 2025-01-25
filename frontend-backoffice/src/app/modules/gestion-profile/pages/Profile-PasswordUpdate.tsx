/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import '../GestionProfile.css';
import { ProfileRequest } from '../core/services/ProfileRequests';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useFormik } from 'formik';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { handleHttpError } from '../../../utils/functions';
import { useAuth } from '../../auth';

const changePasswordFormSchema = Yup.object().shape({
  old_password: Yup.string(),
  new_password: Yup.string()
    .min(6, 'Minimum 6 caractères')
    .required('Le nouveau mot de passe est requis'),
  confirm_password: Yup.string()
    .min(6, 'Minimum 6 caractères')
    .required('Confirmation de passe est requis'),
});

const toUpdateValue = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};

const profileRequests = new ProfileRequest();

const ProfilePasswordUpdate: FC = () => {
  const intl = useIntl();
  const [submitLoader, setsubmitLoader] = useState(false);

  const { logout } = useAuth();
  // const [toUpdateValue, settoUpdateValue] = useState<any>();

  const formkikChangePassword = useFormik({
    initialValues: toUpdateValue,
    validationSchema: changePasswordFormSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setsubmitLoader(true);

      console.log(values);

      // @ts-ignore
      await profileRequests
        .updatePassword(values.old_password, values.new_password)
        .then((response: any) => {
          logout();
          location.reload();
          setStatus(false);
          setSubmitting(false);
          setsubmitLoader(false);
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
          setsubmitLoader(false);
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

  useEffect(() => {
    //   getComplaintTypeList();
  }, []);

  return (
    <>
      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <form
          className="form w-100"
          onSubmit={formkikChangePassword.handleSubmit}
        >
          <div className="modal-content">
            <div className="card-header">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">
                  {intl.formatMessage({ id: 'GEN.PASSWORD' })}
                </h3>
              </div>
            </div>

            <div className="modal-body p-10">
              <div className="row">
                <div className="col-12 col-md-4 mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'USER.OLD_PASSWORD' })}
                  </label>

                  <input
                    placeholder={intl.formatMessage({
                      id: 'USER.OLD_PASSWORD',
                    })}
                    {...formkikChangePassword.getFieldProps('old_password')}
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikChangePassword.touched.old_password &&
                          formkikChangePassword.errors.old_password,
                      },
                      {
                        'is-valid':
                          formkikChangePassword.touched.old_password &&
                          !formkikChangePassword.errors.old_password,
                      },
                    )}
                    type="password"
                    name="old_password"
                    autoComplete="on"
                  />
                  {/* {formkikChangePassword.touched.old_password && formkikChangePassword.errors.old_password && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formkikChangePassword.errors.old_password}</span>
                                        </div>
                                        )} */}
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-4 mb-8">
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

                <div className="col-12 col-md-4 mb-8">
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
            </div>

            <div className="modal-footer p-10">
              {/* <button
                            type="button"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                            >
                            {intl.formatMessage({id: 'GEN.CANCEL'})}
                        </button> */}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formkikChangePassword.values.new_password !=
                    formkikChangePassword.values.confirm_password ||
                  formkikChangePassword.isSubmitting ||
                  !formkikChangePassword.isValid
                }
              >
                {!submitLoader && (
                  <span className="indicator-label">
                    {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                  </span>
                )}
                {submitLoader && (
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
    </>
  );
};

export { ProfilePasswordUpdate };
