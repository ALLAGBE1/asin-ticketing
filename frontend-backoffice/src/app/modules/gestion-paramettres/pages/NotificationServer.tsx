/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG } from '../../../../_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';

import '../GestionParamettres.css';
import { UnityTypeRequest } from '../core/services/UnityTypeRequests';
import { UnityTypeModel } from '../core/models/UnityType';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';
import { NotificationServerRequests } from '../core/services/NotificationServerRequests';
import {
  MailServerModel,
  SmsServerModel,
} from '../core/models/NotificationServer';

const notificationDatasSchema = Yup.object().shape({
  hostname: Yup.string().required('Hostname is required'),
  login: Yup.string().required('Login is required'),
  password: Yup.string().required('Password is required'),
  port: Yup.number().required('Port is required'),
  token: Yup.string().required('token is required'),
});

const notificationServerRequests = new NotificationServerRequests();

const NotificationServer: FC = () => {
  const intl = useIntl();

  const initialValues = new SmsServerModel();

  const [smsDataLoading, setsmsDataLoading] = useState(false);
  const [mailDataLoading, setmailDataLoading] = useState(false);

  const [smsDataloader, setsmsDataloader] = useState(true);
  const [mailDataloader, setmailDataloader] = useState(true);

  const [smsDatas, setsmsDatas] = useState<SmsServerModel>();
  const [mailDatas, setmailDatas] = useState<MailServerModel>();

  const formikSmsData = useFormik({
    initialValues,
    validationSchema: notificationDatasSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setsmsDataLoading(true);
      console.log(values);

      await notificationServerRequests
        .addSmsServerData(values)
        .then((response: any) => {
          closeModal('modal_close-formikSmsData');
          setSubmitting(false);
          setsmsDataLoading(false);
          getSmsServerDatas();
          formikSmsData.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikEmailData = useFormik({
    initialValues,
    validationSchema: notificationDatasSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setmailDataLoading(true);
      console.log(values);

      await notificationServerRequests
        .addEmailServerData(values)
        .then((response: any) => {
          closeModal('modal_close-formikEmailData');
          setSubmitting(false);
          setmailDataLoading(false);
          getEmailServerDatas();
          formikEmailData.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const getEmailServerDatas = async () => {
    setmailDataloader(true);

    await notificationServerRequests
      .getEmailServerData()
      .then((response: any) => {
        console.log();
        setmailDatas(response.data);
        setmailDataloader(false);
        formikEmailData.setValues(response.data);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getSmsServerDatas = async () => {
    setsmsDataloader(true);

    await notificationServerRequests
      .getSmsServerData()
      .then((response: any) => {
        console.log();
        setsmsDatas(response.data);
        setsmsDataloader(false);
        formikSmsData.setValues(response.data);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getEmailServerDatas();
    getSmsServerDatas();
  }, []);

  return (
    <>
      {/* Update SMS Server Data */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikSmsData.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'SETTINGS.UPDATE_SMS_SERVER' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikSmsData"
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
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.HOSTNAME' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({
                      id: 'SETTINGS.HOSTNAME',
                    })}
                    {...formikSmsData.getFieldProps('hostname')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikSmsData.touched.hostname &&
                          formikSmsData.errors.hostname,
                      },
                      {
                        'is-valid':
                          formikSmsData.touched.hostname &&
                          !formikSmsData.errors.hostname,
                      },
                    )}
                    type="text"
                    name="hostname"
                    autoComplete="on"
                  />
                  {formikSmsData.touched.hostname &&
                    formikSmsData.errors.hostname && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikSmsData.errors.hostname}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.LOGIN' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.LOGIN' })}
                    {...formikSmsData.getFieldProps('login')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikSmsData.touched.login &&
                          formikSmsData.errors.login,
                      },
                      {
                        'is-valid':
                          formikSmsData.touched.login &&
                          !formikSmsData.errors.login,
                      },
                    )}
                    type="text"
                    name="login"
                    autoComplete="on"
                  />
                  {formikSmsData.touched.login &&
                    formikSmsData.errors.login && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formikSmsData.errors.login}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PASSWORD' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({
                      id: 'SETTINGS.PASSWORD',
                    })}
                    {...formikSmsData.getFieldProps('password')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikSmsData.touched.password &&
                          formikSmsData.errors.password,
                      },
                      {
                        'is-valid':
                          formikSmsData.touched.password &&
                          !formikSmsData.errors.password,
                      },
                    )}
                    type="text"
                    name="password"
                    autoComplete="on"
                  />
                  {formikSmsData.touched.password &&
                    formikSmsData.errors.password && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikSmsData.errors.password}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PORT' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.PORT' })}
                    {...formikSmsData.getFieldProps('port')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikSmsData.touched.port &&
                          formikSmsData.errors.port,
                      },
                      {
                        'is-valid':
                          formikSmsData.touched.port &&
                          !formikSmsData.errors.port,
                      },
                    )}
                    type="number"
                    name="port"
                    autoComplete="on"
                  />
                  {formikSmsData.touched.port && formikSmsData.errors.port && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formikSmsData.errors.port}</span>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.TOKEN' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.TOKEN' })}
                    {...formikSmsData.getFieldProps('token')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikSmsData.touched.token &&
                          formikSmsData.errors.token,
                      },
                      {
                        'is-valid':
                          formikSmsData.touched.token &&
                          !formikSmsData.errors.token,
                      },
                    )}
                    type="text"
                    name="token"
                    autoComplete="on"
                  />
                  {formikSmsData.touched.token &&
                    formikSmsData.errors.token && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formikSmsData.errors.token}</span>
                      </div>
                    )}
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formikSmsData.isSubmitting || !formikSmsData.isValid
                  }
                >
                  {!smsDataLoading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {smsDataLoading && (
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

      {/* SMS Server Data */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {intl.formatMessage({ id: 'SETTINGS.SMS_SERVER' })}
                </span>
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <ACTION_LONG_BUTTON
                      modalComponentId="#kt_modal_1"
                      text={intl.formatMessage({
                        id: 'SETTINGS.UPDATE_SMS_SERVER',
                      })}
                      permission="admin"
                      styleClass="btn-primary"
                    />
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
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Hostname
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Login
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Password
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Port
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            Token
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{smsDatas?.hostname}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{smsDatas?.login}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{smsDatas?.password}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{smsDatas?.port}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{smsDatas?.token}</h5>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {smsDataloader && !smsDatas ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!smsDataloader && !smsDatas ? (
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

      {/* Update Mail Server Data */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikEmailData.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'UNITY_TYPE.UNITY_TYPE_ADDING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikEmailData"
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
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.HOSTNAME' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({
                      id: 'SETTINGS.HOSTNAME',
                    })}
                    {...formikEmailData.getFieldProps('hostname')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikEmailData.touched.hostname &&
                          formikEmailData.errors.hostname,
                      },
                      {
                        'is-valid':
                          formikEmailData.touched.hostname &&
                          !formikEmailData.errors.hostname,
                      },
                    )}
                    type="text"
                    name="hostname"
                    autoComplete="on"
                  />
                  {formikEmailData.touched.hostname &&
                    formikEmailData.errors.hostname && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikEmailData.errors.hostname}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.LOGIN' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.LOGIN' })}
                    {...formikEmailData.getFieldProps('login')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikEmailData.touched.login &&
                          formikEmailData.errors.login,
                      },
                      {
                        'is-valid':
                          formikEmailData.touched.login &&
                          !formikEmailData.errors.login,
                      },
                    )}
                    type="text"
                    name="login"
                    autoComplete="on"
                  />
                  {formikEmailData.touched.login &&
                    formikEmailData.errors.login && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formikEmailData.errors.login}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PASSWORD' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({
                      id: 'SETTINGS.PASSWORD',
                    })}
                    {...formikEmailData.getFieldProps('password')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikEmailData.touched.password &&
                          formikEmailData.errors.password,
                      },
                      {
                        'is-valid':
                          formikEmailData.touched.password &&
                          !formikEmailData.errors.password,
                      },
                    )}
                    type="text"
                    name="password"
                    autoComplete="on"
                  />
                  {formikEmailData.touched.password &&
                    formikEmailData.errors.password && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikEmailData.errors.password}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PORT' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.PORT' })}
                    {...formikEmailData.getFieldProps('port')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikEmailData.touched.port &&
                          formikEmailData.errors.port,
                      },
                      {
                        'is-valid':
                          formikEmailData.touched.port &&
                          !formikEmailData.errors.port,
                      },
                    )}
                    type="number"
                    name="port"
                    autoComplete="on"
                  />
                  {formikEmailData.touched.port &&
                    formikEmailData.errors.port && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formikEmailData.errors.port}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.TOKEN' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'SETTINGS.TOKEN' })}
                    {...formikEmailData.getFieldProps('token')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikEmailData.touched.token &&
                          formikEmailData.errors.token,
                      },
                      {
                        'is-valid':
                          formikEmailData.touched.token &&
                          !formikEmailData.errors.token,
                      },
                    )}
                    type="text"
                    name="token"
                    autoComplete="on"
                  />
                  {formikEmailData.touched.token &&
                    formikEmailData.errors.token && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formikEmailData.errors.token}</span>
                      </div>
                    )}
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formikEmailData.isSubmitting || !formikEmailData.isValid
                  }
                >
                  {!mailDataLoading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {mailDataLoading && (
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

      {/* SMS Server Data */}
      <div className="row gx-xxl-12" style={{ marginTop: '5rem' }}>
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {intl.formatMessage({ id: 'SETTINGS.MAIL_SERVER' })}
                </span>
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <ACTION_LONG_BUTTON
                      modalComponentId="#kt_modal_2"
                      text={intl.formatMessage({
                        id: 'SETTINGS.UPDATE_MAIL_SERVER',
                      })}
                      permission="admin"
                      styleClass="btn-primary"
                    />
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
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Hostname
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Login
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Password
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Port
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            Token
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{mailDatas?.hostname}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{mailDatas?.login}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{mailDatas?.password}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{mailDatas?.port}</h5>
                            </div>
                          </td>

                          <td className=" text-left">
                            <div className="symbol symbol-45px me-2">
                              <h5>{mailDatas?.token}</h5>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {mailDataloader && !mailDatas ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!mailDataloader && !mailDatas ? (
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

export { NotificationServer };
