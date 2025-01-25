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
import { ResponseChannelRequest } from '../core/services/ResponseChannelRequests';
import { ResponseChannelModel } from '../core/models/ResponseChannel';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';

const responseChannelSchema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
});

const responseChannelRequest = new ResponseChannelRequest();

const ResponseChannel: FC = () => {
  const intl = useIntl();

  const initialValues = new ResponseChannelModel();

  const toUpdateValue = new ResponseChannelModel();

  const [toDeleteValue, settoDeleteValue] = useState<any>();

  const [loading, setLoading] = useState(false);
  const [responseChannelloader, setresponseChannelloader] = useState(true);
  const [responseChannelDeleteloader, setresponseChannelDeleteloader] =
    useState(false);
  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: responseChannelSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await responseChannelRequest
        .addResponseChannel(values)
        .then((response: any) => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getResponseChannelList();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateResponseChannel = useFormik({
    initialValues: toUpdateValue,
    validationSchema: responseChannelSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await responseChannelRequest
        .updateResponseChannel(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateResponseChannel');
          setSubmitting(false);
          setLoading(false);
          getResponseChannelList();
          formikUpdateResponseChannel.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: ResponseChannelModel | any) => {
    formikUpdateResponseChannel.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: ResponseChannelModel | any) => {
    settoDeleteValue(data);
  };

  const getResponseChannelList = async () => {
    setresponseChannelloader(true);

    await responseChannelRequest
      .getResponseChannelList()
      .then((response: any) => {
        setresponseChannelDatas(response.data.items);
        setresponseChannelloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteResponseChannel = async () => {
    setresponseChannelDeleteloader(true);

    await responseChannelRequest
      .deleteResponseChannel(toDeleteValue?.id)
      .then(() => {
        setresponseChannelDeleteloader(false);
        getResponseChannelList();
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getResponseChannelList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.RESPONSE_CHANNEL' })}
      </PageTitle>

      {/* Add New Response Channel modal */}
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
                  {intl.formatMessage({
                    id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_ADDING',
                  })}
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
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.LIBELLE' })}
                    {...formik.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.libelle && formik.errors.libelle,
                      },
                      {
                        'is-valid':
                          formik.touched.libelle && !formik.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formik.touched.libelle && formik.errors.libelle && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.libelle}</span>
                    </div>
                  )}
                </div>

                {/* <div className='d-grid mb-10'>
                                      <button
                                      type='submit'
                                      id='kt_sign_in_submit'
                                      className='btn btn-primary'
                                      disabled={formik.isSubmitting || !formik.isValid}
                                      >
                                      {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'AUTH.GENERAL.SUBMIT_BUTTON'})}</span>}
                                      {loading && (
                                          <span className='indicator-progress' style={{display: 'block'}}>
                                          {intl.formatMessage({id: 'GEN.WAIT'})}
                                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                          </span>
                                      )}
                                      </button>
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

      {/* updating Response Channel modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateResponseChannel.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_UPDATING',
                  })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateResponseChannel"
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
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.LIBELLE' })}
                    {...formikUpdateResponseChannel.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateResponseChannel.touched.libelle &&
                          formikUpdateResponseChannel.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateResponseChannel.touched.libelle &&
                          !formikUpdateResponseChannel.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateResponseChannel.touched.libelle &&
                    formikUpdateResponseChannel.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateResponseChannel.errors.libelle}
                        </span>
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
                    formikUpdateResponseChannel.isSubmitting ||
                    !formikUpdateResponseChannel.isValid
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

      {/* delete Response Channel modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_DELETING',
                  })}
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
                      id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_WOULD_YOU_WANNA_DELETE',
                    })}{' '}
                    :{' '}
                    <span className="text-danger">
                      {toDeleteValue?.libelle}{' '}
                    </span>
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

                <button
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => deleteResponseChannel()}
                >
                  {!responseChannelDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_DELETE',
                      })}
                    </span>
                  )}
                  {responseChannelDeleteloader && (
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

      {/* complaint categories list */}
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
                    <ACTION_LONG_BUTTON
                      modalComponentId="#kt_modal_1"
                      text={intl.formatMessage({
                        id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_ADD',
                      })}
                      permission="response_channel:create"
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
                          <th className="p-0 w-50px fw-bolder text-left">N°</th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            Libelle
                          </th>
                          {/* <th className='p-0 min-w-140px fw-bolder text-left'>Stats</th>
                                      <th className='p-0 min-w-110px fw-bolder text-left'>Statut</th> */}
                          {/* <th className='p-0 min-w-110px fw-bolder text-left'>Date</th> */}
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {responseChannelDatas?.map((row, index) => (
                          <tr key={row.id}>
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.libelle}</h5>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2'>
                                                  <h5>#27</h5>
                                              </div>
                                          </td>
  
                                          <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2'>
                                                  <h5>Activé</h5>
                                              </div>
                                          </td> */}

                            {/* <td className=' text-left'>
                                              <div className='symbol-45px me-2'>
                                                  <span className='text-muted mt-1 fw-semibold fs-7'>{ row.createAt }</span>
                                              </div>
                                              <div className='symbol-45px me-2'>
                                                  <span className='text-muted mt-1 fw-semibold fs-7'>{ row.updateAt }</span>
                                              </div>
                                          </td> */}

                            <td className=" text-left">
                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_UPDATE',
                                })}
                                permission="response_channel:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_DELETE',
                                })}
                                permission="response_channel:delete"
                                icon="trash"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_2"
                                                  title={intl.formatMessage({id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_UPDATE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                              >
                                                  <KTIcon iconName='notepad-edit' className='fs-1' />
                                              </a>
                                              <a
                                                  onClick={() => selectToDelete(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_3"
                                                  title={intl.formatMessage({id: 'RESPONSE_CHANNEL.RESPONSE_CHANNEL_DELETE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light btn-color-danger'
                                              >
                                                  <KTIcon iconName='trash' className='fs-1' />
                                              </a> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {responseChannelloader &&
                      responseChannelDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!responseChannelloader &&
                      responseChannelDatas.length == 0 ? (
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

export { ResponseChannel };
