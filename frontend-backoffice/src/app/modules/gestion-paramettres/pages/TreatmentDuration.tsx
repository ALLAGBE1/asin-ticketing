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
import { TreatmentDurationRequest } from '../core/services/TreatmentDurationRequests';
import { TreatmentDurationModel } from '../core/models/TreatmentDuration';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { notificationSuccessToast } from '../../../utils/notificationToasts';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';

const processingTimeSchema = Yup.object().shape({
  duration: Yup.string().required('Duration is required'),
});

const durationTreatmentRequest = new TreatmentDurationRequest();

const TreatmentDuration: FC = () => {
  const intl = useIntl();

  const initialValues = new TreatmentDurationModel();

  const toUpdateValue = new TreatmentDurationModel();

  const [toDeleteValue, settoDeleteValue] = useState<
    TreatmentDurationModel | any
  >();

  const [loading, setLoading] = useState(false);
  const [processsingTimeloader, setprocesssingTimeloader] = useState(true);
  const [processsingTimeDeleteloader, setprocesssingTimeDeleteloader] =
    useState(false);
  const [processsingTimeDatas, setprocesssingTimeDatas] = useState(
    Array<TreatmentDurationModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: processingTimeSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await durationTreatmentRequest
        .addTreatmentDuration(values)
        .then((response: any) => {
          getDUrationTreatmentList();
          closeModal('modal_close-formik');
          setLoading(false);
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateProcessingTime = useFormik({
    initialValues: toUpdateValue,
    validationSchema: processingTimeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await durationTreatmentRequest
        .updateTreatmentDuration(values)
        .then((response: any) => {
          getDUrationTreatmentList();
          closeModal('modal_close-formikUpdateProcessingTime');
          setLoading(false);
          formikUpdateProcessingTime.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const selectToChange = (data: TreatmentDurationModel | any) => {
    formikUpdateProcessingTime.setValues(data);
  };

  const selectToDelete = (data: TreatmentDurationModel | any) => {
    settoDeleteValue(data);
  };

  const getDUrationTreatmentList = async () => {
    setprocesssingTimeloader(true);

    await durationTreatmentRequest
      .getTreatmentDurationList()
      .then((response: any) => {
        console.log(response.data.items);
        setprocesssingTimeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const deleteProcessingTime = async () => {
    setprocesssingTimeDeleteloader(true);

    await durationTreatmentRequest
      .deleteTreatmentDuration(toDeleteValue?.id)
      .then((response: any) => {
        getDUrationTreatmentList();
        closeModal('modal_close-delete');
        setprocesssingTimeDeleteloader(false);
        notificationSuccessToast(response.msg);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getDUrationTreatmentList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
      </PageTitle>

      {/* Add New Processing Time modal */}
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
                    id: 'PROCESSING_TIME.PROCESSING_TIME_ADDING',
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
                    {intl.formatMessage({ id: 'GEN.DURATION' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.DURATION' })}
                    {...formik.getFieldProps('duration')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.duration && formik.errors.duration,
                      },
                      {
                        'is-valid':
                          formik.touched.duration && !formik.errors.duration,
                      },
                    )}
                    type="number"
                    name="duration"
                    autoComplete="on"
                  />
                  {formik.touched.duration && formik.errors.duration && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.duration}</span>
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

      {/* updating Processing Time modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateProcessingTime.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'PROCESSING_TIME.PROCESSING_TIME_UPDATING',
                  })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateProcessingTime"
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
                    {intl.formatMessage({ id: 'GEN.DURATION' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.DURATION' })}
                    {...formikUpdateProcessingTime.getFieldProps('duration')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateProcessingTime.touched.duration &&
                          formikUpdateProcessingTime.errors.duration,
                      },
                      {
                        'is-valid':
                          formikUpdateProcessingTime.touched.duration &&
                          !formikUpdateProcessingTime.errors.duration,
                      },
                    )}
                    type="number"
                    name="duration"
                    autoComplete="on"
                  />
                  {formikUpdateProcessingTime.touched.duration &&
                    formikUpdateProcessingTime.errors.duration && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateProcessingTime.errors.duration}
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
                    formikUpdateProcessingTime.isSubmitting ||
                    !formikUpdateProcessingTime.isValid
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

      {/* delete Processing Time modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'PROCESSING_TIME.PROCESSING_TIME_DELETING',
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
                      id: 'PROCESSING_TIME.PROCESSING_TIME_WOULD_YOU_WANNA_DELETE',
                    })}{' '}
                    :{' '}
                    <span className="text-danger">
                      {toDeleteValue?.duration}{' '}
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

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => deleteProcessingTime()}
                >
                  {!processsingTimeDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: 'PROCESSING_TIME.PROCESSING_TIME_DELETE',
                      })}
                    </span>
                  )}
                  {processsingTimeDeleteloader && (
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

      {/* complaint categories list */}
      <div className="row g-5 gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {intl.formatMessage({ id: 'GEN.lIST_OF' })}
                  {intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
                </span>
                {/* <span className='text-muted mt-1 fw-semibold fs-7'>More than 400 new products</span> */}
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <ACTION_LONG_BUTTON
                      modalComponentId="#kt_modal_1"
                      text={intl.formatMessage({
                        id: 'PROCESSING_TIME.PROCESSING_TIME_ADD',
                      })}
                      permission="duration_treatment:create"
                      styleClass="btn-primary"
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div className="card-body py-3">
              <div className="">
                <div className="" id="">
                  {/* begin::Table container */}
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                      <thead>
                        <tr className="border-0">
                          <th className="p-0 w-50px fw-bolder text-left">N°</th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.DURATION' })}
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
                        {processsingTimeDatas?.map((row, index) => (
                          <tr key={row.id}>
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>
                                  {row.duration}{' '}
                                  {intl.formatMessage({ id: 'GEN.DAYS' })}
                                </h5>
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
                                  id: 'PROCESSING_TIME.PROCESSING_TIME_UPDATE',
                                })}
                                permission="duration_treatment:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'PROCESSING_TIME.PROCESSING_TIME_DELETE',
                                })}
                                permission="duration_treatment:delete"
                                icon="trash"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#kt_modal_2"
                                                title={intl.formatMessage({id: 'PROCESSING_TIME.PROCESSING_TIME_UPDATE'})}
                                                className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                            >
                                                <KTIcon iconName='notepad-edit' className='fs-1' />
                                            </a>
                                            <a
                                                onClick={() => selectToDelete(row)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#kt_modal_3"
                                                title={intl.formatMessage({id: 'PROCESSING_TIME.PROCESSING_TIME_DELETE'})}
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
                      {processsingTimeloader &&
                      processsingTimeDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!processsingTimeloader &&
                      processsingTimeDatas.length == 0 ? (
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

export { TreatmentDuration };
