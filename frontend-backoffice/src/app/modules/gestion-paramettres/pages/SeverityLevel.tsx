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
import { SeverityLevelRequest } from '../core/services/SeverityLevelRequests';
import { SeverityLevelModel } from '../core/models/SeverityLevel';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';

const severityLevelSchema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
  code_color: Yup.string().required('Color Code is required'),
  description: Yup.string().required('Description is required'),
});

const severityLevelRequest = new SeverityLevelRequest();

const SeverityLevel: FC = () => {
  const intl = useIntl();

  const initialValues = new SeverityLevelModel();

  const toUpdateValue = new SeverityLevelModel();

  const [toDeleteValue, settoDeleteValue] = useState<
    SeverityLevelModel | any
  >();

  const [loading, setLoading] = useState(false);
  const [severityLevelloader, setseverityLevelloader] = useState(true);
  const [severityLevelDeleteloader, setseverityLevelDeleteloader] =
    useState(false);
  const [severityLevelDatas, setseverityLevelDatas] = useState(
    Array<SeverityLevelModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: severityLevelSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await severityLevelRequest
        .addSeverityLevel(values)
        .then((response: any) => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getSeverityLevelList();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateSeverityLevel = useFormik({
    initialValues: toUpdateValue,
    validationSchema: severityLevelSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await severityLevelRequest
        .updateSeverityLevel(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateSeverityLevel');
          setSubmitting(false);
          setLoading(false);
          getSeverityLevelList();
          formikUpdateSeverityLevel.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: SeverityLevelModel | any) => {
    formikUpdateSeverityLevel.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: SeverityLevelModel | any) => {
    settoDeleteValue(data);
  };

  const getSeverityLevelList = async () => {
    setseverityLevelloader(true);

    await severityLevelRequest
      .getSeverityLevelList()
      .then((response: any) => {
        setseverityLevelDatas(response.data.items);
        setseverityLevelloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteComplaintCategory = async () => {
    setseverityLevelDeleteloader(true);

    await severityLevelRequest
      .deleteSeverityLevel(toDeleteValue?.id)
      .then(() => {
        getSeverityLevelList();
        setseverityLevelDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getSeverityLevelList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
      </PageTitle>

      {/* Add New Severity Level modal */}
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
                    id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_ADDING',
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

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.COLOR_CODE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.COLOR_CODE' })}
                    {...formik.getFieldProps('code_color')}
                    className={clsx(
                      'color_input form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.code_color && formik.errors.code_color,
                      },
                      {
                        'is-valid':
                          formik.touched.code_color &&
                          !formik.errors.code_color,
                      },
                    )}
                    type="color"
                    name="code_color"
                    autoComplete="on"
                  />
                  {formik.touched.code_color && formik.errors.code_color && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.code_color}</span>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
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

      {/* updating Severity Level modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateSeverityLevel.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_UPDATING',
                  })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateSeverityLevel"
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
                    {...formikUpdateSeverityLevel.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateSeverityLevel.touched.libelle &&
                          formikUpdateSeverityLevel.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateSeverityLevel.touched.libelle &&
                          !formikUpdateSeverityLevel.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateSeverityLevel.touched.libelle &&
                    formikUpdateSeverityLevel.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateSeverityLevel.errors.libelle}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.COLOR_CODE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.COLOR_CODE' })}
                    {...formikUpdateSeverityLevel.getFieldProps('code_color')}
                    className={clsx(
                      'color_input form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateSeverityLevel.touched.code_color &&
                          formikUpdateSeverityLevel.errors.code_color,
                      },
                      {
                        'is-valid':
                          formikUpdateSeverityLevel.touched.code_color &&
                          !formikUpdateSeverityLevel.errors.code_color,
                      },
                    )}
                    type="color"
                    name="code_color"
                    autoComplete="on"
                  />
                  {formikUpdateSeverityLevel.touched.code_color &&
                    formikUpdateSeverityLevel.errors.code_color && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateSeverityLevel.errors.code_color}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                  </label>
                  <textarea
                    cols={20}
                    rows={5}
                    placeholder={intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                    {...formikUpdateSeverityLevel.getFieldProps('description')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateSeverityLevel.touched.description &&
                          formikUpdateSeverityLevel.errors.description,
                      },
                      {
                        'is-valid':
                          formikUpdateSeverityLevel.touched.description &&
                          !formikUpdateSeverityLevel.errors.description,
                      },
                    )}
                    name="description"
                    autoComplete="on"
                  ></textarea>
                  {formikUpdateSeverityLevel.touched.description &&
                    formikUpdateSeverityLevel.errors.description && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateSeverityLevel.errors.description}
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
                    formikUpdateSeverityLevel.isSubmitting ||
                    !formikUpdateSeverityLevel.isValid
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

      {/* delete Severity Level modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_DELETING',
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
                      id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_WOULD_YOU_WANNA_DELETE',
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

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => deleteComplaintCategory()}
                >
                  {!severityLevelDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_DELETE',
                      })}
                    </span>
                  )}
                  {severityLevelDeleteloader && (
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

      {/* Severity Level list */}
      <div className="row g-5 gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {intl.formatMessage({ id: 'GEN.lIST_OF' })}
                  {intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
                </span>
                {/* <span className='text-muted mt-1 fw-semibold fs-7'>More than 400 new products</span> */}
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <ACTION_LONG_BUTTON
                      modalComponentId="#kt_modal_1"
                      text={intl.formatMessage({
                        id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_ADD',
                      })}
                      permission="severity_level:create"
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
                            Libelle
                          </th>
                          <th className="p-0 min-w-140px fw-bolder text-left">
                            Description
                          </th>
                          <th className="p-0 min-w-110px fw-bolder text-left">
                            Color
                          </th>
                          {/* <th className='p-0 min-w-110px fw-bolder text-left'>Date</th> */}
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {severityLevelDatas?.map((row, index) => (
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

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>{row.description}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 w-100">
                                <h5
                                  className="text-center p-4"
                                  style={{
                                    backgroundColor: row.code_color,
                                    borderRadius: '7px',
                                  }}
                                >
                                  {row.code_color}
                                </h5>
                              </div>
                            </td>

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
                                  id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_UPDATE',
                                })}
                                permission="severity_level:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_DELETE',
                                })}
                                permission="severity_level:delete"
                                icon="trash"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#kt_modal_2"
                                                title={intl.formatMessage({id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_UPDATE'})}
                                                className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                            >
                                                <KTIcon iconName='notepad-edit' className='fs-1' />
                                            </a>
                                            <a
                                                onClick={() => selectToDelete(row)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#kt_modal_3"
                                                title={intl.formatMessage({id: 'SEVERITY_LEVEL.SEVERITY_LEVEL_DELETE'})}
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
                      {severityLevelloader && severityLevelDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!severityLevelloader &&
                      severityLevelDatas.length == 0 ? (
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

export { SeverityLevel };
