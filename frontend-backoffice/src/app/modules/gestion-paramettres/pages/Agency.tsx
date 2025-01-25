/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';
import { ACTION_LONG_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LONG_BUTTON';
import { ACTION_LIST_ROW_MINI_BUTTON } from '../../../utils/actions-permission-handler/ACTION_LIST_ROW_MINI_BUTTON';
import { AgencyModel } from '../core/models/Agency';
import { AgencyRequest } from '../core/services/AgencyRequest';
import { IsAHolding } from '../../../utils/permissionAccessHandler';
import { InstitutionModel } from '../core/models/Institution';
import CsvDownloadButton from 'react-json-to-csv';

const agencySchema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
});

const agencyRequest = new AgencyRequest();

const Agency: FC = () => {

  const intl = useIntl();
  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const [filteredInstitution, setfilteredInstitution] = useState<any>(
    IsAHolding() ? null : user_datas.unity.institution.id,
  );

  const [institutionDatas, setinstitutionDatas] = useState<any>(
    Array<InstitutionModel>,
  );

  const [ref, setref] = useState('');

  const initialValues = new AgencyModel();

  const toUpdateValue = new AgencyModel();

  const [toDeleteValue, settoDeleteValue] = useState<any>();

  const [loading, setLoading] = useState(false);
  const [agencyloader, setagencyloader] = useState(true);
  const [agencyDeleteloader, setagencyDeleteloader] =
    useState(false);
  const [agencyDatas, setagencyDatas] = useState(
    Array<AgencyModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: agencySchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await agencyRequest
        .addAgency(values, user_datas.unity.institution.id)
        .then((response: any) => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getAgenciesList();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateAgency = useFormik({
    initialValues: toUpdateValue,
    validationSchema: agencySchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await agencyRequest
        .updateAgency(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateAgency');
          setSubmitting(false);
          setLoading(false);
          getAgenciesList();
          formikUpdateAgency.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: AgencyModel | any) => {
    formikUpdateAgency.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: AgencyModel | any) => {
    settoDeleteValue(data);
  };

  const getAgenciesList = async (institution_id: number = user_datas.unity.institution.id) => {
    setagencyloader(true);

    await agencyRequest
      .getAgencyList(1, 200, institution_id, '')
      .then((response: any) => {
        setagencyDatas(response.data.items);
        setagencyloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteComplaintCategory = async () => {
    setagencyDeleteloader(true);

    await agencyRequest
      .deleteAgency(toDeleteValue?.id)
      .then(() => {
        getAgenciesList();
        setagencyDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };
  
    const getAgenciesFilteredByName = async (_ref: string) => {
  
      console.log(_ref)
      setagencyloader(true);
      setref(_ref);

      await agencyRequest
        .getAgencyList(1, 200, user_datas.unity.institution.id, _ref)
        .then((response: any) => {
          setagencyDatas(response.data.items);
          setagencyloader(false);
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
  
      // await adminUsersAccountRequest
      //   .getFilteredUser(
      //     IsAHolding() ? filteredInstitution : null,
      //     filteredUserState,
      //     filteredRole,
      //     page,
      //     rowsPerPageSize,
      //     _ref,
      //     _ref
      //   )
      //   .then((response: any) => {
      //     console.log(response.data.items);
      //     setagencyDatas(response.data.items);
      //     setagencyloader(false);
      //   })
      //   .catch((error: any) => {
      //     handleHttpError(error);
      //   });
    };

  const changeInstitutionFilter = (event: any) => {
    console.log(event.target.value);

    const institution_id = event.target.value;
    setfilteredInstitution(institution_id);
    getAgenciesList(institution_id);
  };

  useEffect(() => {
    getAgenciesList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.AGENCIES' })}
      </PageTitle>

      {/* Add New Agency modal */}
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
                    id: 'AGENCY.AGENCY_ADDING',
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

      {/* updating Agency modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateAgency.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'AGENCY.AGENCY_UPDATING',
                  })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateAgency"
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
                    {...formikUpdateAgency.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateAgency.touched.libelle &&
                          formikUpdateAgency.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateAgency.touched.libelle &&
                          !formikUpdateAgency.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateAgency.touched.libelle &&
                    formikUpdateAgency.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateAgency.errors.libelle}
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
                    formikUpdateAgency.isSubmitting ||
                    !formikUpdateAgency.isValid
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

      {/* delete Agency modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({
                    id: 'AGENCY.AGENCY_DELETING',
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
                      id: 'AGENCY.AGENCY_WOULD_YOU_WANNA_DELETE',
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
                  {!agencyDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: 'AGENCY.AGENCY_DELETE',
                      })}
                    </span>
                  )}
                  {agencyDeleteloader && (
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

              <div className="card-title">
                {/* begin::Search */}
                <div className="d-flex align-items-center position-relative my-1">
                  <KTIcon
                    iconName="magnifier"
                    className="fs-1 position-absolute ms-6"
                  />
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => getAgenciesFilteredByName(e.target.value)}
                    data-kt-user-table-filter="search"
                    className="form-control bg-transparent w-300px ps-14"
                    placeholder={'Recherche...'}
                  />
                </div>
                {/* end::Search */}
              </div>

              <div className="card-toolbar">

                <div
                className="d-flex justify-content-end"
                data-kt-user-table-toolbar="base"
                >

                  {IsAHolding() && (
                      <select
                        className="col-2 form-control w-auto bg-transparent me-3"
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        value={filteredInstitution}
                        onChange={() => changeInstitutionFilter(event)}
                      >
                        <option value={''}>
                          {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                            intl.formatMessage({
                              id: 'SETTINGS.INSTITUTION',
                            })}
                        </option>
                        {institutionDatas?.map((row: any, index: number) => (
                          <option key={index} value={row.id}>
                            {row.name}
                          </option>
                        ))}
                      </select>
                  )}

                  <CsvDownloadButton
                      className="btn btn-light-primary me-3"
                      filename={intl.formatMessage({ id: 'SETTINGS.AGENCIES'})}
                      delimiter=';'
                      headers={['Libelle']}
                      data={agencyDatas.map((e:any, i:number) => {
                      return {
                        'libelle': e.libelle,
                      }
                    } )}
                    >
                      <KTIcon iconName="file-down" className="fs-2" />
                      {intl.formatMessage({ id: 'GEN.EXPORT' })}
                  </CsvDownloadButton>

                  <ACTION_LONG_BUTTON
                        modalComponentId="#kt_modal_1"
                        text={intl.formatMessage({
                          id: 'AGENCY.AGENCY_ADD',
                        })}
                        permission="reception_channel:create"
                        styleClass="btn-primary"
                  />

                </div>

              </div>

            </div>

            <div className="card-body pt-8 py-3">
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
                        {agencyDatas?.map((row, index) => (
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
                                  id: 'AGENCY.AGENCY_UPDATE',
                                })}
                                permission="reception_channel:update"
                                icon="notepad-edit"
                                styleClass="btn-sm btn-icon btn-bg-light btn-color-warning"
                                onClickAction={() => selectToChange(row)}
                              />

                              <ACTION_LIST_ROW_MINI_BUTTON
                                modalComponentId="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'AGENCY.AGENCY_DELETE',
                                })}
                                permission="reception_channel:delete"
                                icon="trash"
                                styleClass="mx-3 btn-sm btn-icon btn-bg-light btn-color-danger"
                                onClickAction={() => selectToDelete(row)}
                              />

                              {/* <a  onClick={() => selectToChange(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_2"
                                                  title={intl.formatMessage({id: 'AGENCY.AGENCY_UPDATE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                              >
                                                  <KTIcon iconName='notepad-edit' className='fs-1' />
                                              </a>
                                              <a
                                                  onClick={() => selectToDelete(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_3"
                                                  title={intl.formatMessage({id: 'AGENCY.AGENCY_DELETE'})}
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
                      {agencyloader &&
                      agencyDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!agencyloader &&
                      agencyDatas.length == 0 ? (
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

export { Agency };
