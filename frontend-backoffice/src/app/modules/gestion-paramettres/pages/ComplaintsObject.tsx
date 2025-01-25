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

import { ComplaintObjectRequest } from '../core/services/ComplaintsObjectRequest';
import { ComplaintCategoryRequest } from '../core/services/ComplaintsCategoryRequest';
import { TreatmentDurationRequest } from '../core/services/TreatmentDurationRequests';
import { SeverityLevelRequest } from '../core/services/SeverityLevelRequests';
import { ComplaintObjectModel } from '../core/models/ComplaintObject';
import { ComplaintCategoryModel } from '../core/models/ComplaintCategory';
import { TreatmentDurationModel } from '../core/models/TreatmentDuration';
import { SeverityLevelModel } from '../core/models/SeverityLevel';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';

const complaintObjectShema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
  description: Yup.string().required('Descrition is required'),
  severity_level_id: Yup.string().required('Security Level is required'),
  duration_treatment_id: Yup.string().required(
    'Duration treatment is required',
  ),
  category_id: Yup.string().required('Claim category is required'),
});

const complaintObjectRequest = new ComplaintObjectRequest();

const complaintCategoryRequest = new ComplaintCategoryRequest();
const treatmentDurationRequest = new TreatmentDurationRequest();
const severityLevelRequest = new SeverityLevelRequest();

const ComplaintObject: FC = () => {
  const intl = useIntl();

  const initialValues = new ComplaintObjectModel();

  const toUpdateValue = new ComplaintObjectModel();

  const [toDeleteValue, settoDeleteValue] = useState<
    ComplaintObjectModel | any
  >();

  const [loading, setLoading] = useState(false);
  const [complaintObjectloader, setcomplaintObjectloader] = useState(true);
  const [complaintObjectDeleteloader, setcomplaintObjectDeleteloader] =
    useState(false);
  const [complaintObjectDatas, setcomplaintObjectDatas] = useState(
    Array<ComplaintObjectModel | any>,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [complainCategoryDatas, setcomplainCategoryDatas] = useState(
    Array<ComplaintCategoryModel>,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [treatmentDurationDatas, settreatmentDurationDatas] = useState(
    Array<TreatmentDurationModel>,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [severityLevelDatas, setseverityLevelDatas] = useState(
    Array<SeverityLevelModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: complaintObjectShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await complaintObjectRequest
        .addComplaintObject(values)
        .then(() => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getComplaintObjects();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  const formikUpdateComplaintObject = useFormik({
    initialValues: toUpdateValue,
    validationSchema: complaintObjectShema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      const _object = {
        id: values.id,
        libelle: values.libelle,
        description: values.description,
        category_id: values.category_id,
        severity_level_id: values.severity_level_id,
        duration_treatment_id: values.duration_treatment_id,
      };

      await complaintObjectRequest
        .updateComplaintObject(_object)
        .then(() => {
          closeModal('modal_close-formikUpdateComplaintObject');
          setSubmitting(false);
          setLoading(false);
          getComplaintObjects();
          formikUpdateComplaintObject.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  const selectToChange = (data: ComplaintObjectModel | any) => {
    console.log(data);
    formikUpdateComplaintObject.setValues({
      ...data,
      ...{
        category_id: data.category.id,
        duration_treatment_id: data.duration_treatment.id,
        severity_level_id: data.severity_level.id,
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: ComplaintObjectModel | any) => {
    settoDeleteValue(data);
  };

  const getComplaintObjects = async () => {
    setcomplaintObjectloader(true);

    await complaintObjectRequest
      .getComplaintObjectList()
      .then((response: any) => {
        setcomplaintObjectDatas(response.data.items);
        setcomplaintObjectloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getTreatmentDurationList = async () => {
    await treatmentDurationRequest
      .getTreatmentDurationList()
      .then((response: any) => {
        settreatmentDurationDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getSeverityLevelList = async () => {
    await severityLevelRequest
      .getSeverityLevelList()
      .then((response: any) => {
        setseverityLevelDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintCategoriList = async () => {
    await complaintCategoryRequest
      .getComplaintCategoriesList()
      .then((response: any) => {
        console.log(response.data.items)
        setcomplainCategoryDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const deleteComplaintObject = async () => {
    setcomplaintObjectDeleteloader(true);

    await complaintObjectRequest
      .deleteComplaintObject(toDeleteValue?.id)
      .then(() => {
        getComplaintObjects();
        setcomplaintObjectDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getTreatmentDurationList();
    getComplaintCategoriList();
    getSeverityLevelList();
    getComplaintObjects();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
      </PageTitle>

      {/* Add New complaint object modal */}
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
                  {intl.formatMessage({ id: 'COMPLAINT.OBJECT_ADDING' })}
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

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.severity_level_id &&
                          formik.errors.severity_level_id,
                      },
                      {
                        'is-valid':
                          formik.touched.severity_level_id &&
                          !formik.errors.severity_level_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('severity_level_id')}
                  >
                    <option>Veuillez selectionner le niveau de sévérité</option>

                    {severityLevelDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.severity_level_id &&
                    formik.errors.severity_level_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formik.errors.severity_level_id}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.duration_treatment_id &&
                          formik.errors.duration_treatment_id,
                      },
                      {
                        'is-valid':
                          formik.touched.duration_treatment_id &&
                          !formik.errors.duration_treatment_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('duration_treatment_id')}
                  >
                    <option>Veuillez selectionner la durrée</option>

                    {treatmentDurationDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.duration} {intl.formatMessage({ id: 'GEN.DAYS' })}
                      </option>
                    ))}
                  </select>

                  {formik.touched.duration_treatment_id &&
                    formik.errors.duration_treatment_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formik.errors.duration_treatment_id}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.category_id &&
                          formik.errors.category_id,
                      },
                      {
                        'is-valid':
                          formik.touched.category_id &&
                          !formik.errors.category_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('category_id')}
                  >
                    <option>Veuillez selectionner une catégorie</option>

                    {complainCategoryDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.category_id && formik.errors.category_id && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.category_id}</span>
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

      {/* updating complaint object modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateComplaintObject.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'COMPLAINT.OBJECT_UPDATING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateComplaintObject"
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
                    {...formikUpdateComplaintObject.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateComplaintObject.touched.libelle &&
                          formikUpdateComplaintObject.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateComplaintObject.touched.libelle &&
                          !formikUpdateComplaintObject.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateComplaintObject.touched.libelle &&
                    formikUpdateComplaintObject.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateComplaintObject.errors.libelle}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                  </label>

                  <textarea
                    placeholder={intl.formatMessage({ id: 'GEN.DESCRIPTION' })}
                    {...formikUpdateComplaintObject.getFieldProps(
                      'description',
                    )}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateComplaintObject.touched.description &&
                          formikUpdateComplaintObject.errors.description,
                      },
                      {
                        'is-valid':
                          formikUpdateComplaintObject.touched.description &&
                          !formikUpdateComplaintObject.errors.description,
                      },
                    )}
                    name="description"
                  ></textarea>

                  {formikUpdateComplaintObject.touched.description &&
                    formikUpdateComplaintObject.errors.description && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateComplaintObject.errors.description}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateComplaintObject.touched
                            .severity_level_id &&
                          formikUpdateComplaintObject.errors.severity_level_id,
                      },
                      {
                        'is-valid':
                          formikUpdateComplaintObject.touched
                            .severity_level_id &&
                          !formikUpdateComplaintObject.errors.severity_level_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateComplaintObject.getFieldProps(
                      'severity_level_id',
                    )}
                  >
                    <option>Veuillez selectionner le niveau de sévérité</option>

                    {severityLevelDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateComplaintObject.touched.severity_level_id &&
                    formikUpdateComplaintObject.errors.severity_level_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateComplaintObject.errors.severity_level_id}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateComplaintObject.touched
                            .duration_treatment_id &&
                          formikUpdateComplaintObject.errors
                            .duration_treatment_id,
                      },
                      {
                        'is-valid':
                          formikUpdateComplaintObject.touched
                            .duration_treatment_id &&
                          !formikUpdateComplaintObject.errors
                            .duration_treatment_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateComplaintObject.getFieldProps(
                      'duration_treatment_id',
                    )}
                  >
                    <option>Veuillez selectionner la durrée</option>

                    {treatmentDurationDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.duration} {intl.formatMessage({ id: 'GEN.DAYS' })}
                      </option>
                    ))}
                  </select>

                  {formikUpdateComplaintObject.touched.duration_treatment_id &&
                    formikUpdateComplaintObject.errors
                      .duration_treatment_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {
                            formikUpdateComplaintObject.errors
                              .duration_treatment_id
                          }
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateComplaintObject.touched.category_id &&
                          formikUpdateComplaintObject.errors.category_id,
                      },
                      {
                        'is-valid':
                          formikUpdateComplaintObject.touched.category_id &&
                          !formikUpdateComplaintObject.errors.category_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateComplaintObject.getFieldProps(
                      'category_id',
                    )}
                  >
                    <option>Veuillez selectionner une catégorie</option>

                    {complainCategoryDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateComplaintObject.touched.category_id &&
                    formikUpdateComplaintObject.errors.category_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateComplaintObject.errors.category_id}
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
                    formikUpdateComplaintObject.isSubmitting ||
                    !formikUpdateComplaintObject.isValid
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

      {/* delete product modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'COMPLAINT.OBJECT_DELETING' })}
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
                      id: 'COMPLAINT.OBJECT_WOULD_YOU_WANNA_DELETE',
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
                  onClick={() => deleteComplaintObject()}
                >
                  {!complaintObjectDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'COMPLAINT.OBJECT_DELETE' })}
                    </span>
                  )}
                  {complaintObjectDeleteloader && (
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
                      text={intl.formatMessage({ id: 'COMPLAINT.OBJECT_ADD' })}
                      permission="object:create"
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
                            {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.COMPLAINT_CATEGORY',
                            })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.PROSSESSING_TIMES',
                            })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-center">
                            {intl.formatMessage({
                              id: 'SETTINGS.SEVERITY_LEVEL',
                            })}
                          </th>
                          <th className="p-0 min-w-100px fw-bolder text-center">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {complaintObjectDatas?.map((row, index) => (
                          <tr key={row.id} className="mb-2">
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className="p-0 mt-2 min-w-150px w-400px text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.libelle}</h5>
                                <span className="text-justify">
                                  {row.description}
                                </span>
                              </div>
                            </td>

                            <td className="p-0 mt-2 min-w-150px fw-bolder text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.category.libelle}</h5>
                              </div>
                            </td>

                            <td className="p-0 mt-2 min-w-150px fw-bolder text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>
                                  {row.duration_treatment.duration}{' '}
                                  {intl.formatMessage({ id: 'GEN.DAYS' })}
                                </h5>
                              </div>
                            </td>

                            <td className="p-0 mt-2 min-w-150px fw-bolder text-center">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5
                                  style={{
                                    backgroundColor:
                                      row.severity_level.code_color,
                                    borderRadius: '7px',
                                  }}
                                  className=" min-w-150px text-center p-3"
                                >
                                  {row.severity_level.libelle}
                                </h5>
                              </div>
                            </td>

                            <td className="p-0 mt-2 min-w-50px fw-bolder text-center">
                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'COMPLAINT.OBJECT_UPDATE',
                                })}
                                permission="object:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'COMPLAINT.OBJECT_DELETE',
                                })}
                                permission="object:delete"
                                icon="trash"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#kt_modal_2"
                                                    title={intl.formatMessage({id: 'COMPLAINT.OBJECT_UPDATE'})}
                                                    className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                                >
                                                    <KTIcon iconName='notepad-edit' className='fs-1' />
                                                </a>
                                                <a
                                                    onClick={() => selectToDelete(row)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#kt_modal_3"
                                                    title={intl.formatMessage({id: 'COMPLAINT.OBJECT_DELETE'})}
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
                      {complaintObjectloader &&
                      complaintObjectDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!complaintObjectloader &&
                      complaintObjectDatas.length == 0 ? (
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

export { ComplaintObject };
