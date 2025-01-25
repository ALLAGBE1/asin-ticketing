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
import { UnityRequest } from '../core/services/UnityRequests';
import { UnityTypeRequest } from '../core/services/UnityTypeRequests';
import { UnityModel } from '../core/models/Unity';
import { UnityTypeModel } from '../core/models/UnityType';
import { InstitutionRequest } from '../core/services/InstitutionRequests';
import { InstitutionModel } from '../core/models/Institution';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError, mergeArrays } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';
import { ComplaintObjectRequest } from '../core/services/ComplaintsObjectRequest';
import { ComplaintObjectModel } from '../core/models/ComplaintObject';
import { IsAHolding } from '../../../utils/permissionAccessHandler';

const unitySchema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
  unity_type_id: Yup.string().required('Unity type is required'),
  institution_id: Yup.string().required('institution Type is required'),
});

const formikAffectNewObjectShema = Yup.object().shape({
  object_id: Yup.number(),
});

const unityRequest = new UnityRequest();
const unityTypeRequest = new UnityTypeRequest();
const institutionRequest = new InstitutionRequest();
const objectsRequest = new ComplaintObjectRequest();

const Unity: FC = () => {
  const intl = useIntl();

  const initialValues = new UnityModel();
  const initialObjectValues:any = {};

  const toUpdateValue = new UnityModel();

  const [toDeleteValue, settoDeleteValue] = useState<UnityModel | any>();
  const [_toUpdateValue, _settoUpdateValue] = useState<UnityModel | any>();

  const [loading, setLoading] = useState(false);
  const [unityloader, setUnityloader] = useState(true);
  const [unityDeleteloader, setunityDeleteloader] = useState(false);
  const [unityDatas, setUnityDatas] = useState(Array<UnityModel | any>);
  const [objectDatas, setObjectDatas] = useState(Array<ComplaintObjectModel | any>);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unityTypeDatas, setunityTypeDatas] = useState(Array<UnityTypeModel>);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [institutionDatas, setinstitutionDatas] = useState(
    Array<InstitutionModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: unitySchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await unityRequest
        .addUnity(values)
        .then((response: any) => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getUnitiesList();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikAffecteObject = useFormik({
    initialValues: initialObjectValues,
    validationSchema: formikAffectNewObjectShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      // await unityRequest
      //   .addUnity(values)
      //   .then((response: any) => {
      //     closeModal('modal_close-formik');
      //     setSubmitting(false);
      //     setLoading(false);
      //     getUnitiesList();
      //     formik.resetForm();
      //   })
      //   .catch((error: any) => {
      //     handleHttpError(error);
      //   });
    },
  });

  const formikUpdateUnity = useFormik({
    initialValues: toUpdateValue,
    validationSchema: unitySchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await unityRequest
        .updateUnity(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateUnity');
          setSubmitting(false);
          setLoading(false);
          getUnitiesList();
          formikUpdateUnity.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: UnityModel | any) => {
    _settoUpdateValue(data);
    formikUpdateUnity.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: UnityModel | any) => {
    settoDeleteValue(data);
  };

  const getComplaintObjects = async () => {

    await objectsRequest
      .getComplaintObjectList()
      .then((response: any) => {
        // setObjectDatas(response.data.items);
        console.log(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUnitiesList = async () => {
    setUnityloader(true);

    if(IsAHolding()) {
      await unityRequest
        .getUnityListByInstitutionId()
        .then((response: any) => {
          console.log(response.data.items)
          setUnityDatas(response.data.items);
          setUnityloader(false);
        })
        .catch((error: any) => {
          handleHttpError(error);
        });

    }else {
      await unityRequest
        .getUnityListByInstitutionId()
        .then((response: any) => {
          console.log(response.data)
          setUnityDatas(response.data);
          setUnityloader(false);
        })
        .catch((error: any) => {
          handleHttpError(error);
        });

    }

  };

  const getUnityTypeList = async () => {
    await unityTypeRequest
      .getUnityTypeList()
      .then((response: any) => {
        setunityTypeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getInstitutionList = async () => {
    await institutionRequest
      .getInstitutionList()
      .then((response: any) => {
        setinstitutionDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const deleteUnity = async () => {
    setunityDeleteloader(true);

    await unityRequest
      .deleteUnity(toDeleteValue?.id)
      .then((response: any) => {
        getUnitiesList();
        setunityDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getUnityTypeList();
    getInstitutionList();
    getComplaintObjects();
    getUnitiesList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.UNITY' })}
      </PageTitle>

      {/* Add New Unity modal */}
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
                  {intl.formatMessage({ id: 'UNITY.UNITY_ADDING' })}
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
                    {intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.institution_id &&
                          formik.errors.institution_id,
                      },
                      {
                        'is-valid':
                          formik.touched.institution_id &&
                          !formik.errors.institution_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('institution_id')}
                  >
                    <option>Veuillez selectionner le type d'Institution</option>

                    {institutionDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                  </select>

                  {formik.touched.institution_id &&
                    formik.errors.institution_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.institution_id}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.UNITY_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.unity_type_id &&
                          formik.errors.unity_type_id,
                      },
                      {
                        'is-valid':
                          formik.touched.unity_type_id &&
                          !formik.errors.unity_type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('unity_type_id')}
                  >
                    <option>Veuillez selectionner le type d'Unité</option>

                    {unityTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.unity_type_id &&
                    formik.errors.unity_type_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.unity_type_id}</span>
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

      {/* updating Unity modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateUnity.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'UNITY.UNITY_UPDATING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateUnity"
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
                    {...formikUpdateUnity.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateUnity.touched.libelle &&
                          formikUpdateUnity.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateUnity.touched.libelle &&
                          !formikUpdateUnity.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateUnity.touched.libelle &&
                    formikUpdateUnity.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateUnity.errors.libelle}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateUnity.touched.institution_id &&
                          formikUpdateUnity.errors.institution_id,
                      },
                      {
                        'is-valid':
                          formikUpdateUnity.touched.institution_id &&
                          !formikUpdateUnity.errors.institution_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateUnity.getFieldProps('institution_id')}
                  >
                    <option>Veuillez selectionner le type d'Institution</option>

                    {institutionDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                  </select>

                  {formikUpdateUnity.touched.institution_id &&
                    formikUpdateUnity.errors.institution_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateUnity.errors.institution_id}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.UNITY_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateUnity.touched.unity_type_id &&
                          formikUpdateUnity.errors.unity_type_id,
                      },
                      {
                        'is-valid':
                          formikUpdateUnity.touched.unity_type_id &&
                          !formikUpdateUnity.errors.unity_type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateUnity.getFieldProps('unity_type_id')}
                  >
                    <option>Veuillez selectionner le type d'Unité</option>

                    {unityTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateUnity.touched.unity_type_id &&
                    formikUpdateUnity.errors.unity_type_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateUnity.errors.unity_type_id}
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
                    formikUpdateUnity.isSubmitting || !formikUpdateUnity.isValid
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

      {/* delete Unity modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'UNITY.UNITY_DELETING' })}
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
                      id: 'UNITY.UNITY_WOULD_YOU_WANNA_DELETE',
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
                  onClick={() => deleteUnity()}
                >
                  {!unityDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'UNITY.UNITY_DELETE' })}
                    </span>
                  )}
                  {unityDeleteloader && (
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

      {/* manage Unity-Objects modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_4">
        <div className="modal-dialog">
          <form className="form w-100"
            onSubmit={formikAffecteObject.handleSubmit}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'UNITY.AFFECT_NEW_OBJECT' })}
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
                  {/* <h4 className="text-center" style={{ marginBottom: '3rem' }}>
                    {intl.formatMessage({
                      id: 'UNITY.AFFECT_NEW_OBJECT',
                    })}
                  </h4> */}

                  <div className="col-12 mb-7">

                    {/* <label className="required fw-bold fs-6 mb-5">Objets</label> */}

                    {_toUpdateValue?.objects?.map((row:any, index:number) => (
                      <>
                        <div key={index} className="d-flex fv-row mb-2">
                          <div className="form-check form-check-custom form-check-solid">
                            <input
                              className="form-check-input me-3"
                              {...formikAffecteObject.getFieldProps('object_id')}
                              name="role_id"
                              type="radio"
                              value={row.id}
                              id={`kt_modal_affect_new_role_option_${index}`}
                            />

                            <label
                              className="form-check-label"
                              htmlFor={`kt_modal_affect_new_role_option_${index}`}
                            >
                              <div className="fw-bolder text-gray-800">
                                {row.libelle}
                              </div>
                              <div className="text-gray-600">
                                {row.description}
                              </div>
                            </label>
                          </div>
                        </div>
                      </>
                    ))}
                    <br />
                  </div>
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
                        formikAffecteObject.touched
                            .object_id &&
                            formikAffecteObject.errors.object_id,
                      },
                      {
                        'is-valid':
                          formikAffecteObject.touched.object_id &&
                          !formikAffecteObject.errors.object_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikAffecteObject.getFieldProps(
                      'object_id',
                    )}
                  >
                    <option>Veuillez selectionner le niveau de sévérité</option>

                    { objectDatas.filter((e) => !_toUpdateValue?.objects.includes(e)) .map((row:any, index:number) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

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
                  onClick={() => deleteUnity()}
                >
                  {!unityDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'UNITY.UNITY_DELETE' })}
                    </span>
                  )}
                  {unityDeleteloader && (
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
                      text={intl.formatMessage({ id: 'UNITY.UNITY_ADD' })}
                      permission="unity:create"
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
                            {intl.formatMessage({ id: 'UNITY.COMPLAINT_OBJECT_LINKED' })}
                          </th>
                          {
                            IsAHolding() &&
                            <th className="p-0 min-w-150px fw-bolder text-left">
                              {intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
                            </th>
                          }
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'SETTINGS.UNITY_TYPE' })}
                          </th>
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {unityDatas?.map((row, index) => (
                          <>

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
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.objects?.length}</h5>
                              </div>
                            </td>

                            {
                              IsAHolding() &&
                              <td className=" text-left">
                                <div className="symbol symbol-45px me-2 text-hover-primary">
                                  <h5>{row.institution.name}</h5>
                                </div>
                              </td>
                            }

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.unity_type.libelle}</h5>
                              </div>
                            </td>

                            <td className=" text-left">

                              <div className="d-flex justify-content-end flex-shrink-0">

                                <ACTION_LIST_ROW_MINI_BUTTON
                                  modalComponentId="#kt_modal_2"
                                  title={intl.formatMessage({
                                    id: 'UNITY.UNITY_UPDATE',
                                  })}
                                  permission="unity:update"
                                  icon="notepad-edit"
                                  styleClass="btn-sm btn-icon btn-bg-light mx-2 btn-color-warning"
                                  onClickAction={() => selectToChange(row)}
                                />

                                <ACTION_LIST_ROW_MINI_BUTTON
                                  modalComponentId="#kt_modal_4"
                                  title={intl.formatMessage({
                                    id: 'UNITY.COMPLAINT_OBJECT_LINKED',
                                  })}
                                  permission="unity:update"
                                  icon="colors-square"
                                  styleClass="btn-sm btn-icon btn-bg-light mx-2 btn-color-dark"
                                  onClickAction={() => selectToChange(row)}
                                />

                                <ACTION_LIST_ROW_MINI_BUTTON
                                  modalComponentId="#kt_modal_3"
                                  title={intl.formatMessage({
                                    id: 'UNITY.UNITY_DELETE',
                                  })}
                                  permission="unity:delete"
                                  icon="trash"
                                  styleClass="btn-sm btn-icon btn-bg-light mx-2 btn-color-danger"
                                  onClickAction={() => selectToDelete(row)}
                                />

                              </div>

                              {/* <a  onClick={() => selectToChange(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_2"
                                                  title={intl.formatMessage({id: 'UNITY.UNITY_UPDATE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light mx-2 btn-color-warning'
                                              >
                                                  <KTIcon iconName='notepad-edit' className='fs-1' />
                                              </a>
                                              <a
                                                  onClick={() => selectToDelete(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_3"
                                                  title={intl.formatMessage({id: 'UNITY.UNITY_DELETE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light mx-2 btn-color-danger'
                                              >
                                                  <KTIcon iconName='trash' className='fs-1' />
                                              </a> */}
                            </td>
                          </tr>

                          </>

                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {unityloader && unityDatas?.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!unityloader && unityDatas?.length == 0 ? (
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

export { Unity };
