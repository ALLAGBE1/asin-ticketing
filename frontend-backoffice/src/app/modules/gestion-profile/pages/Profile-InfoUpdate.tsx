/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { FC, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import '../GestionProfile.css';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { ProfileRequest } from '../core/services/ProfileRequests';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { handleHttpError } from '../../../utils/functions';
import { Profile } from '../core/models/profile';

let USER_DATAS: any;

const claimToUpdateSchema = Yup.object().shape({
  address: Yup.string(),
  city: Yup.string(),
  department: Yup.string(),
  email: Yup.string()
    .required('Email is required')
    .email('Email format is required'),
  first_name: Yup.string().required('FirstName is required'),
  last_name: Yup.string().required('LastName is required'),
  sex: Yup.string().required('Sex is required'),
  telephone: Yup.string().required('Telephone is required'),
});

const profileRequests = new ProfileRequest();

const ProfileInfoUpdate: FC = () => {
  const intl = useIntl();
  const [submitLoader, setsubmitLoader] = useState(false);
  const [toUpdateValue, settoUpdateValue] = useState<any>();

  const formkikUpdateUserdatas = useFormik({
    initialValues: toUpdateValue,
    validationSchema: claimToUpdateSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setsubmitLoader(true);

      const satisfaction_datas = {
        ...values,
        ...{ id: USER_DATAS?.profile.id },
      };

      console.log(values);

      // @ts-ignore
      await profileRequests
        .updateUserProfile(satisfaction_datas)
        .then((response: any) => {
          // console.log(response)
          localStorage.setItem(
            import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS,
            JSON.stringify({
              ...USER_DATAS,
              ...{ profile: response.data },
            }),
          );
          location.reload();
          setSubmitting(false);
          setsubmitLoader(false);
          notificationSuccessToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.USER_UPDATED_SUCCESS' }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          setsubmitLoader(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'USER_ACCOUNT.USER_UPDATED_ERROR' }),
            5000,
          );
        });
    },
  });

  useEffect(() => {
    //@ts-ignore
    USER_DATAS = JSON.parse(
      //@ts-ignore
      localStorage.getItem(
        import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS,
      ),
    );

    settoUpdateValue({
      address: USER_DATAS?.profile.address,
      city: USER_DATAS?.profile.city,
      department: USER_DATAS?.profile.department,
      email: USER_DATAS?.profile.email,
      first_name: USER_DATAS?.profile.first_name,
      last_name: USER_DATAS?.profile.last_name,
      sex: USER_DATAS?.profile.sex,
      telephone: USER_DATAS?.profile.telephone,
    });

    // toUpdateValue = {
    //     address: USER_DATAS?.profile.address,
    //     city: USER_DATAS?.profile.city,
    //     department: USER_DATAS?.profile.department,
    //     email: USER_DATAS?.profile.email,
    //     first_name: USER_DATAS?.profile.first_name,
    //     last_name: USER_DATAS?.profile.last_name,
    //     sex: USER_DATAS?.profile.sex,
    //     telephone: USER_DATAS?.profile.telephone
    // };

    //   getComplaintTypeList();
  }, []);

  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'GEN.CUSTOMER'})}</PageTitle> */}

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <form
          className="form w-100"
          onSubmit={formkikUpdateUserdatas.handleSubmit}
        >
          <div className="modal-content">
            <div className="card-header">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">
                  {intl.formatMessage({ id: 'GEN.OVERVIEW' })}
                </h3>
              </div>
            </div>

            <div className="modal-body row p-10">
              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                  {...formkikUpdateUserdatas.getFieldProps('first_name')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.first_name &&
                        formkikUpdateUserdatas.errors.first_name,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.first_name &&
                        !formkikUpdateUserdatas.errors.first_name,
                    },
                  )}
                  type="text"
                  name="first_name"
                  autoComplete="on"
                />
                {/* {formkikUpdateUserdatas.touched.first_name && formkikUpdateUserdatas.errors.first_name && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formkikUpdateUserdatas.errors.first_name}</span>
                                    </div>
                                    )} */}
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.LASTNAME' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.LASTNAME' })}
                  {...formkikUpdateUserdatas.getFieldProps('last_name')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.last_name &&
                        formkikUpdateUserdatas.errors.last_name,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.last_name &&
                        !formkikUpdateUserdatas.errors.last_name,
                    },
                  )}
                  type="text"
                  name="last_name"
                  autoComplete="on"
                />
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.SEXE' })}
                </label>

                <select
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.sex &&
                        formkikUpdateUserdatas.errors.sex,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.sex &&
                        !formkikUpdateUserdatas.errors.sex,
                    },
                  )}
                  data-control="select2"
                  data-placeholder="Latest"
                  data-hide-search="true"
                  {...formkikUpdateUserdatas.getFieldProps('sex')}
                >
                  <option>Veuillez selectionner le genre</option>
                  <option value={'M'}>
                    {intl.formatMessage({ id: 'GEN.MALE' })}
                  </option>
                  <option value={'F'}>
                    {intl.formatMessage({ id: 'GEN.FEMALE' })}
                  </option>
                </select>
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.DEPARTMENT' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.DEPARTMENT' })}
                  {...formkikUpdateUserdatas.getFieldProps('department')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.department &&
                        formkikUpdateUserdatas.errors.department,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.department &&
                        !formkikUpdateUserdatas.errors.department,
                    },
                  )}
                  type="text"
                  name="department"
                  autoComplete="on"
                />
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.CITY' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.CITY' })}
                  {...formkikUpdateUserdatas.getFieldProps('city')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.city &&
                        formkikUpdateUserdatas.errors.city,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.city &&
                        !formkikUpdateUserdatas.errors.city,
                    },
                  )}
                  type="text"
                  name="city"
                  autoComplete="on"
                />
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.ADDRESS' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.ADDRESS' })}
                  {...formkikUpdateUserdatas.getFieldProps('address')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.address &&
                        formkikUpdateUserdatas.errors.address,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.address &&
                        !formkikUpdateUserdatas.errors.address,
                    },
                  )}
                  type="text"
                  name="address"
                  autoComplete="on"
                />
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.PHONE' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.PHONE' })}
                  {...formkikUpdateUserdatas.getFieldProps('telephone')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.telephone &&
                        formkikUpdateUserdatas.errors.telephone,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.telephone &&
                        !formkikUpdateUserdatas.errors.telephone,
                    },
                  )}
                  type="text"
                  name="telephone"
                  autoComplete="on"
                />
              </div>

              <div className="col-12 col-md-4 mb-8">
                <label className="form-label fs-6 fw-bolder text-gray-900">
                  {intl.formatMessage({ id: 'USER.EMAIL' })}
                </label>

                <input
                  placeholder={intl.formatMessage({ id: 'USER.EMAIL' })}
                  {...formkikUpdateUserdatas.getFieldProps('email')}
                  className={clsx(
                    'form-control bg-transparent h-40px',
                    {
                      'is-invalid':
                        formkikUpdateUserdatas.touched.email &&
                        formkikUpdateUserdatas.errors.email,
                    },
                    {
                      'is-valid':
                        formkikUpdateUserdatas.touched.email &&
                        !formkikUpdateUserdatas.errors.email,
                    },
                  )}
                  type="text"
                  name="email"
                  autoComplete="on"
                />
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
                  formkikUpdateUserdatas.isSubmitting ||
                  !formkikUpdateUserdatas.isValid
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

export { ProfileInfoUpdate };
