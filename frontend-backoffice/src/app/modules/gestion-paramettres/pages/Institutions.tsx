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
import { InstitutionRequest } from '../core/services/InstitutionRequests';
import { InstitutionModel } from '../core/models/Institution';
import { InstitutionTypeRequest } from '../core/services/InstitutionTypeRequest';
import { InstitutionTypeModel } from '../core/models/InstitutionType';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';

const institutionSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  acronym: Yup.string().required('Acronyme is required'),
  //   iso_code: Yup.string()
  //     .required('ISO Code is required'),
  type_institution_id: Yup.string().required('Institution type is required'),
});

const institutionRequest = new InstitutionRequest();
const institutionTypeRequest = new InstitutionTypeRequest();

const Institution: FC = () => {
  const intl = useIntl();

  const initialValues = new InstitutionModel();
  const toUpdateValue = new InstitutionModel();

  const [toDeleteValue, settoDeleteValue] = useState<InstitutionModel | any>();

  const [loading, setLoading] = useState(false);
  const [institutionloader, setinstitutionloader] = useState(true);
  const [institutionDeleteloader, setinstitutionDeleteloader] = useState(false);
  const [institutionDatas, setinstitutionDatas] = useState(
    Array<InstitutionModel | any>,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [institutionTypeDatas, setinstitutionTypeDatas] = useState(
    Array<InstitutionTypeModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: institutionSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await institutionRequest
        .addInstitution(values)
        .then(() => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getIntitutionList();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  const formikUpdateInsitution = useFormik({
    initialValues: toUpdateValue,
    validationSchema: institutionSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await institutionRequest
        .updateInstitution(values)
        .then(() => {
          closeModal('modal_close-formikUpdateInsitution');
          setSubmitting(false);
          setLoading(false);
          getIntitutionList();
          formikUpdateInsitution.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: InstitutionModel | any) => {
    formikUpdateInsitution.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: InstitutionModel | any) => {
    settoDeleteValue(data);
  };

  const getIntitutionList = async () => {
    setinstitutionloader(true);

    await institutionRequest
      .getInstitutionList()
      .then((response: any) => {
        setinstitutionDatas(response.data.items);
        setinstitutionloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getInstitutionTypeList = async () => {
    await institutionTypeRequest
      .getInstitutionTypeList()
      .then((response: any) => {
        setinstitutionTypeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const deleteInstitution = async () => {
    setinstitutionDeleteloader(true);

    await institutionRequest
      .deleteInstitution(toDeleteValue?.id)
      .then(() => {
        getIntitutionList();
        setinstitutionDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getIntitutionList();
    getInstitutionTypeList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
      </PageTitle>

      {/* Add New insitution modal */}
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
                  {intl.formatMessage({ id: 'INSTITUTION.INSTITUTION_ADDING' })}
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

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 requi">
                    {intl.formatMessage({ id: 'GEN.ACRONYM' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.ACRONYM' })}
                    {...formik.getFieldProps('acronym')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.acronym && formik.errors.acronym,
                      },
                      {
                        'is-valid':
                          formik.touched.acronym && !formik.errors.acronym,
                      },
                    )}
                    type="text"
                    name="acronym"
                    autoComplete="on"
                  />
                  {formik.touched.acronym && formik.errors.acronym && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.acronym}</span>
                    </div>
                  )}
                </div>

                {/* <div className='fv-row mb-8'>
                                      <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'GEN.ISO_CODE'})}</label>
                                      <input
                                      placeholder={intl.formatMessage({id: 'GEN.ISO_CODE'})}
                                      {...formik.getFieldProps('iso_code')}
                                      className={clsx(
                                          'form-control bg-transparent',
                                          {'is-invalid': formik.touched.iso_code && formik.errors.iso_code},
                                          {
                                          'is-valid': formik.touched.iso_code && !formik.errors.iso_code,
                                          }
                                      )}
                                      type='text'
                                      name='iso_code'
                                      autoComplete='on'
                                      />
                                      {formik.touched.iso_code && formik.errors.iso_code && (
                                      <div className='fv-plugins-message-container'>
                                          <span role='alert'>{formik.errors.iso_code}</span>
                                      </div>
                                      )}
                                  </div> */}

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 requi">
                    {intl.formatMessage({ id: 'SETTINGS.INSTITUTION_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.type_institution_id &&
                          formik.errors.type_institution_id,
                      },
                      {
                        'is-valid':
                          formik.touched.type_institution_id &&
                          !formik.errors.type_institution_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('type_institution_id')}
                  >
                    <option>Veuillez selectionner le type d'institution</option>

                    {institutionTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.type_institution_id &&
                    formik.errors.type_institution_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formik.errors.type_institution_id}
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

      {/* updating insitution modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateInsitution.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'INSTITUTION.INSTITUTION_UPDATING',
                  })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateInsitution"
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
                  <label className="form-label fs-6 fw-bolder text-gray-900 requi">
                    {intl.formatMessage({ id: 'GEN.NAME' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.NAME' })}
                    {...formikUpdateInsitution.getFieldProps('name')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateInsitution.touched.name &&
                          formikUpdateInsitution.errors.name,
                      },
                      {
                        'is-valid':
                          formikUpdateInsitution.touched.name &&
                          !formikUpdateInsitution.errors.name,
                      },
                    )}
                    type="text"
                    name="name"
                    autoComplete="on"
                  />
                  {formikUpdateInsitution.touched.name &&
                    formikUpdateInsitution.errors.name && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateInsitution.errors.name}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 requi">
                    {intl.formatMessage({ id: 'GEN.ACRONYM' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.ACRONYM' })}
                    {...formikUpdateInsitution.getFieldProps('acronym')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateInsitution.touched.acronym &&
                          formikUpdateInsitution.errors.acronym,
                      },
                      {
                        'is-valid':
                          formikUpdateInsitution.touched.acronym &&
                          !formikUpdateInsitution.errors.acronym,
                      },
                    )}
                    type="text"
                    name="acronym"
                    autoComplete="on"
                  />
                  {formikUpdateInsitution.touched.acronym &&
                    formikUpdateInsitution.errors.acronym && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateInsitution.errors.acronym}
                        </span>
                      </div>
                    )}
                </div>

                {/* <div className='fv-row mb-8'>
                                      <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'GEN.ISO_CODE'})}</label>
                                      <input
                                      placeholder={intl.formatMessage({id: 'GEN.ISO_CODE'})}
                                      {...formikUpdateInsitution.getFieldProps('iso_code')}
                                      className={clsx(
                                          'form-control bg-transparent',
                                          {'is-invalid': formikUpdateInsitution.touched.iso_code && formikUpdateInsitution.errors.iso_code},
                                          {
                                          'is-valid': formikUpdateInsitution.touched.iso_code && !formikUpdateInsitution.errors.iso_code,
                                          }
                                      )}
                                      type='text'
                                      name='iso_code'
                                      autoComplete='on'
                                      />
                                      {formikUpdateInsitution.touched.iso_code && formikUpdateInsitution.errors.iso_code && (
                                      <div className='fv-plugins-message-container'>
                                          <span role='alert'>{formikUpdateInsitution.errors.iso_code}</span>
                                      </div>
                                      )}
                                  </div> */}

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 requi">
                    {intl.formatMessage({ id: 'SETTINGS.INSTITUTION_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateInsitution.touched.type_institution_id &&
                          formikUpdateInsitution.errors.type_institution_id,
                      },
                      {
                        'is-valid':
                          formikUpdateInsitution.touched.type_institution_id &&
                          !formikUpdateInsitution.errors.type_institution_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateInsitution.getFieldProps(
                      'type_institution_id',
                    )}
                  >
                    <option>Veuillez selectionner le type d'institution</option>

                    {institutionTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateInsitution.touched.type_institution_id &&
                    formikUpdateInsitution.errors.type_institution_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateInsitution.errors.type_institution_id}
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
                    formikUpdateInsitution.isSubmitting ||
                    !formikUpdateInsitution.isValid
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

      {/* delete insitution modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'INSTITUTION.INSTITUTION_DELETING',
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
                      id: 'INSTITUTION.INSTITUTION_WOULD_YOU_WANNA_DELETE',
                    })}{' '}
                    :{' '}
                    <span className="text-danger">{toDeleteValue?.name} </span>
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
                  onClick={() => deleteInstitution()}
                >
                  {!institutionDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: 'INSTITUTION.INSTITUTION_DELETE',
                      })}
                    </span>
                  )}
                  {institutionDeleteloader && (
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
                      text={intl.formatMessage({
                        id: 'INSTITUTION.INSTITUTION_ADD',
                      })}
                      permission="institution:create"
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
                            {intl.formatMessage({ id: 'GEN.NAME' })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.ACRONYM' })}
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.ISO_CODE'})}</th> */}
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.INSTITUTION_TYPE',
                            })}
                          </th>
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {institutionDatas?.map((row, index) => (
                          <tr key={row.id}>
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.name}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.acronym}</h5>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{row.iso_code}</h5>
                                              </div>
                                          </td> */}

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.institution_type.libelle}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'INSTITUTION.INSTITUTION_UPDATE',
                                })}
                                permission="institution:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'INSTITUTION.INSTITUTION_DELETE',
                                })}
                                permission="institution:delete"
                                icon="trash"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_2"
                                                  title={intl.formatMessage({id: 'INSTITUTION.INSTITUTION_UPDATE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                              >
                                                  <KTIcon iconName='notepad-edit' className='fs-1' />
                                              </a>
                                              <a
                                                  onClick={() => selectToDelete(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_3"
                                                  title={intl.formatMessage({id: 'INSTITUTION.INSTITUTION_DELETE'})}
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
                      {institutionloader && institutionDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!institutionloader && institutionDatas.length == 0 ? (
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

export { Institution };
