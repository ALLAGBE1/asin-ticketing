/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../../_metronic/layout/core';
import { KTIcon, KTSVG } from '../../../../../_metronic/helpers';

import { ClaimModel } from '../../core/models/Claim';
import { ClaimRequest } from '../../core/services/ClaimRequest';
import { useNavigate } from 'react-router-dom';
import { ResponseChannelRequest } from '../../../gestion-paramettres/core/services/ResponseChannelRequests';
import { ResponseChannelModel } from '../../../gestion-paramettres/core/models/ResponseChannel';
import { MenuComponent } from '../../../../../_metronic/assets/ts/components';
import { TablePagination } from '@mui/material';
import { LongClaimsTable } from '../../components/claimTables/longClaimsTable';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../../utils/functions';
import clsx from 'clsx';
import { handleUserPermissionAccess, IsAHolding } from '../../../../utils/permissionAccessHandler';
import { applyPermissionGuards } from 'dom-elements-guards-react';
import { LevelRequests } from '../../../gestion-paramettres/core/services/LevelRequests';
import { LevelModel } from '../../../gestion-paramettres/core/models/Level';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();
const levelRequest = new LevelRequests();

type ClaimFilterOptions = {
  status_id?: number | any;
  institution_id?: number | any;
  user_id?: number | any;
  canMakeFilter?: boolean | any;
  canExportClaim?: boolean | any;
  canImportClaim?: boolean | any;
  canAddClaim?: boolean | any;
  with_satisfaction?: boolean | any;
};

const LongClaimsTableFilter: FC<ClaimFilterOptions> = ({status_id = null, institution_id = null, user_id = null, canMakeFilter, canExportClaim = false, canImportClaim = false, canAddClaim = false , with_satisfaction = false}) => {

  const statusId = status_id;
  let institutionId = institution_id;
  let userId = user_id;
  const _canMakeFilter = canMakeFilter;
  const _canExportClaim = canExportClaim;
  const _canImportClaim = canImportClaim;
  const _canAddClaim = canAddClaim;

  const API_URL_2 = import.meta.env.VITE_APP_SATTIS_BASE_URL_2;

  const claim_importer_template_download_link_file = `${API_URL_2}/api/v1/generate_claims_to_excel`;

  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  // institutionId ??= user_datas.unity.institution.id;

  const intl = useIntl();

  const navigate = useNavigate();

  const [claimloader, setclaimloader] = useState(true);

  const [ref, setref] = useState('');
  const [client_name_or_client_email, setclient_name_or_client_email] = useState('');

  const today = new Date();

  // const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);

  const maxDate = currentDate
    .toISOString()
    .substr(0, currentDate.toISOString().length - 1);

  const [startDate, setstartDate] = useState<number | any>();
  const [endDate, setendDate] = useState<number | any>();

  const [responseChannelId, setResponseChannelId] = useState<number | any>();
  const [satisfactionLevel, setsatisfactionLevel] = useState<number | any>();
  const [userImportLoader, setuserImportLoader] = useState(false);

  const [page, setpage] = useState(0);
  const [rowsPerPageSize, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
  const [totalItems, settotalItems] = useState(0);

  const [userImporterFile, setuserImporterFile] = useState<File | any>();
  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const [levelDatas, setlevelDatas] = useState(Array<LevelModel>);

  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );

  const newClaim = () => {
    navigate('/claims/new');
  };

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    setuserImporterFile(file);
    console.log(file);
  };

  const submitUploadFile = async () => {
    setuserImportLoader(true);

    await claimRequest
      .addMultipleClaimsByExcelFile(userImporterFile)
      .then((response: any) => {
        // setclaimDatas(response.data.items);
        console.log(response.data);
        closeModal('kt_modal_upload_users_file');
        setuserImporterFile(null);
        setuserImportLoader(false);
        makeFilter();
        location.reload();
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const resetFilter = async () => {

    setResponseChannelId('');
    setsatisfactionLevel('')
    setstartDate('')
    setendDate('')
    setref('');
    setclient_name_or_client_email('');

    setclaimloader(true);

    setTimeout(async () => {
      await claimRequest
        .getClaimFilteredListByAllOptions(null, null, institution_id, null, null, null, null, statusId, ref, null, null, null, page, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
        .then((response: any) => {
          settotalItems(response.data.total);
          setclaimDatas(response.data.items);
          setclaimloader(false);
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    }, 1000);
  };

  const makeFilter = async () => {

    setclaimloader(true);

    await claimRequest
      .getClaimFilteredListByAllOptions(responseChannelId, null, institution_id, null, null, null, null, statusId, ref, satisfactionLevel, startDate, endDate, page, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaims = async () => {

    setclaimloader(true);

    await claimRequest
      .getClaimFilteredListByAllOptions(null, null, institution_id, null, null, null, null, statusId, null, satisfactionLevel, startDate, endDate, page, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const changePages = async (event: any, value: any) => {
    console.log(value);

    setclaimloader(true);
    setpage(value);

    await claimRequest
      .getClaimFilteredListByAllOptions(null, null, institution_id, null, null, null, null, statusId, null, satisfactionLevel, startDate, endDate, value, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const handleChangeRowsPerPage = async (event: any) => {
    setclaimloader(true);

    const rowsPerPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPageSize);
    setpage(1);

    await claimRequest
      .getClaimFilteredListByAllOptions(null, null, institution_id, null, null, null, null, statusId, null, satisfactionLevel, startDate, endDate, page, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimsFilteredByRef = async (_ref: string) => {
    setclaimloader(true);
    setref(_ref);

    await claimRequest
      .getClaimFilteredListByAllOptions(responseChannelId, null, institution_id, null, null, null, null, statusId, _ref, satisfactionLevel, startDate, endDate, page, rowsPerPageSize, with_satisfaction, client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimsFilteredByClientNameorEmail = async (_client_name_or_client_email: string) => {
    setclaimloader(true);
    setclient_name_or_client_email(_client_name_or_client_email);

    await claimRequest
      .getClaimFilteredListByAllOptions(responseChannelId, null, institution_id, null, null, null, null, statusId, ref, satisfactionLevel, startDate, endDate, page, rowsPerPageSize, with_satisfaction, _client_name_or_client_email)
      .then((response: any) => {
        settotalItems(response.data.total);
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getResponseChannelList = async () => {
    await responseChannelRequest
      .getResponseChannelList()
      .then((response: any) => {
        setresponseChannelDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getLevelsList = async () => {

    await levelRequest
      .getLevelList()
      .then((response: any) => {
        setlevelDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getClaims();
    getLevelsList();
    getResponseChannelList();
    applyPermissionGuards();

    MenuComponent.reinitialization();
  }, []);

  return (
    <>

      {/* complaint categories list */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>

            <div className="card-header border-0 pt-6">
              {/* add multiple claims by uploading, modal */}
              <div
                className="modal fade"
                id="kt_modal_upload_users_file"
                tabIndex={-1}
              >
                <div className="modal-dialog mw-600px">
                  <form className="form w-100" noValidate>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {intl.formatMessage({
                            id: 'CLAIMS.UPLOADING_CLAIMS',
                          })}
                        </h5>
                        <div
                          className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                          id="modal_close-formikUploadFile"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <KTSVG
                            path="media/icons/duotune/arrows/arr061.svg"
                            className="svg-icon svg-icon-2x"
                          />
                        </div>
                      </div>

                      <div className="modal-body">
                        <div className="col-12 mb-7">
                          <h4 className="text-center">
                            {intl.formatMessage({
                              id: 'CLAIMS.EXPORT_IMPORT_FILE_TEMPLATE',
                            })}
                            ,
                            <a
                              href={claim_importer_template_download_link_file}
                              target="blank"
                            >
                              {intl.formatMessage({ id: 'GEN.DOWNLOAD_HERE' })}
                            </a>
                          </h4>
                        </div>

                        <div className="col-12 mb-7">
                          <label className="required form-label fs-6 fw-bolder text-gray-900">
                            {intl.formatMessage({
                              id: 'GEN.SELECT_PRE_FILLED_FILE',
                            })}
                          </label>

                          <input
                            className={clsx(
                              'form-control bg-transparent',
                              { 'is-invalid': !userImporterFile },
                              {
                                'is-valid': userImporterFile,
                              },
                            )}
                            onChange={onFileChange}
                            type="file"
                            accept=".xlsx, .csv"
                          />
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() =>
                            closeModal('modal_close-formikUploadFile')
                          }
                          className="btn btn-light"
                          data-bs-dismiss="modal"
                        >
                          {intl.formatMessage({ id: 'GEN.CANCEL' })}
                        </button>

                        <a
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => submitUploadFile()}
                        >
                          {!userImportLoader && (
                            <span className="indicator-label">
                              {intl.formatMessage({ id: 'GEN.IMPORT' })}
                            </span>
                          )}
                          {userImportLoader && (
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
              {/* add multiple claims by uploading, modal end */}

              {/* export multiple claims modal */}
              <div
                className="modal fade"
                id="kt_modal_export_users_file"
                tabIndex={-1}
              >
                <div className="modal-dialog mw-600px">
                  <form className="form w-100" noValidate>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {intl.formatMessage({
                            id: 'CLAIMS.EXPORTING_CLAIMS',
                          })}
                        </h5>
                        <div
                          className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                          id="modal_close-formikUploadFile"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <KTSVG
                            path="media/icons/duotune/arrows/arr061.svg"
                            className="svg-icon svg-icon-2x"
                          />
                        </div>
                      </div>

                      <div className="modal-body">
                        <div className="col-12 mb-7">
                          <h2 className="text-center">
                            {intl.formatMessage({ id: 'CLAIMS.EXPORTING_MSG' })}
                          </h2>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() =>
                            closeModal('modal_close-formikExportFile')
                          }
                          className="btn btn-light"
                          data-bs-dismiss="modal"
                        >
                          {intl.formatMessage({ id: 'GEN.CANCEL' })}
                        </button>

                        <a
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => submitUploadFile()}
                        >
                          {!userImporterFile && (
                            <span className="indicator-label">
                              {intl.formatMessage({ id: 'GEN.EXPORT' })}
                            </span>
                          )}
                          {userImporterFile && (
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
              {/* export multiple claims modal end */}

              <div className="card-title" data-permission-guard={handleUserPermissionAccess('claims:read')}>
                {/* begin::Search */}
                <div className="d-flex align-items-center position-relative my-1">
                  <KTIcon
                    iconName="magnifier"
                    className="fs-1 position-absolute ms-6"
                  />
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => getClaimsFilteredByRef(e.target.value)}
                    data-kt-user-table-filter="search"
                    className="form-control bg-transparent w-300px ps-14"
                    placeholder={intl.formatMessage({
                      id: 'GEN.SEARCH_BY_REF',
                    })}
                  />
                </div>
                {/* end::Search */}
                {/* begin::Search by name */}
                <div className="d-flex align-items-center position-relative my-1" style={{marginLeft: '1rem'}}>
                  <KTIcon
                    iconName="magnifier"
                    className="fs-1 position-absolute ms-6"
                  />
                  <input
                    type="text"
                    value={client_name_or_client_email}
                    onChange={(e) => getClaimsFilteredByClientNameorEmail(e.target.value)}
                    data-kt-user-table-filter="search"
                    className="form-control bg-transparent w-300px ps-14"
                    placeholder={'Filtre par nom du client'}
                  />
                </div>
                {/* end::Search by name */}
              </div>

              {/* begin::Card toolbar */}
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  {/* begin::Filter Button */}
                  {

                    _canMakeFilter &&

                    <>

                      <button
                        type="button"
                        className="btn btn-secondary me-3"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                        data-permission-guard={handleUserPermissionAccess('reception_channel:read')}
                      >
                        <KTIcon iconName="filter" className="fs-2" />
                        {intl.formatMessage({ id: 'GEN.FILTER' })}
                      </button>
                      {/* end::Filter Button */}
                      {/* begin::SubMenu */}
                      <div
                        className="menu menu-sub menu-sub-dropdown w-300px w-md-400px"
                        data-kt-menu="true"
                      >
                        {/* begin::Header */}
                        <div className="px-7 py-5">
                          <div className="fs-5 text-gray-900 fw-bolder">
                            {intl.formatMessage({ id: 'GEN.FILTER_OPTIONS' })}
                          </div>
                        </div>
                        {/* end::Header */}

                        {/* begin::Separator */}
                        <div className="separator border-gray-200"></div>
                        {/* end::Separator */}

                        {/* begin::Content */}
                        <div className="px-7 py-5" data-kt-user-table-filter="form">

                          {/* begin::Input group */}
                          <div className="mb-10">
                            <label className="form-label fs-6 fw-bold">
                              {intl.formatMessage({ id: 'GEN.RECEIVING_CANAL' })}
                            </label>

                            <select
                              className="form-select form-select-solid fw-bolder"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-allow-clear="true"
                              data-kt-user-table-filter="role"
                              data-hide-search="true"
                              onChange={(e) => setResponseChannelId(e.target.value)}
                              value={responseChannelId}
                            >
                              {/* <option value=''></option>
                                            <option value='Administrator'>Administrator</option>
                                            <option value='Analyst'>Analyst</option>
                                            <option value='Developer'>Developer</option>
                                            <option value='Support'>Support</option>
                                            <option value='Trial'>Trial</option> */}

                              <option value={''}>
                                {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                                  intl.formatMessage({ id: 'GEN.RECEIVING_CANAL' })}
                              </option>

                              {responseChannelDatas?.map((row, index) => (
                                <option key={index} value={row.id}>
                                  {row.libelle}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* end::Input group */}

                          {/* begin::Input group */}
                          <div className="mb-10">
                            <label className="form-label fs-6 fw-bold">
                            {intl.formatMessage({ id: 'CLAIM.LEVEL' })}
                            </label>

                            <select
                              className="form-select form-select-solid fw-bolder"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-allow-clear="true"
                              data-kt-user-table-filter="role"
                              data-hide-search="true"
                              onChange={(e) => setsatisfactionLevel(e.target.value)}
                              value={satisfactionLevel}
                            >

                              <option value={''}>
                                {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                                  intl.formatMessage({ id: 'CLAIM.LEVEL' })}
                              </option>

                              {levelDatas?.map((row, index) => (
                                <option key={index} value={row.id}>
                                  {row.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* end::Input group */}

                          {/* begin::Input group */}
                          <div className="mb-10">
                            <label className="form-label fs-6 fw-bold">
                              {intl.formatMessage({ id: 'CLAIMS_REPORT.START_DATE' })}
                            </label>

                            <input
                              // type="date"
                              // max={maxDate}
                              type="datetime-local"
                              max={maxDate}
                              value={startDate}
                              onChange={(e) => setstartDate(e.target.value)}
                              data-kt-user-table-filter="search"
                              className="form-control bg-transparent w-100 ps-14"
                              // placeholder={intl.formatMessage({
                              //   id: 'GEN.SEARCH_BY_REF',
                              // })}
                              />

                          </div>
                          {/* end::Input group */}

                          {/* begin::Input group */}
                          <div className="mb-10">
                            <label className="form-label fs-6 fw-bold">
                              {intl.formatMessage({ id: 'CLAIMS_REPORT.END_DATE' })}
                            </label>

                            <input
                              // type="date"
                              // max={maxDate}
                              type="datetime-local"
                              max={maxDate}
                              value={endDate}
                              onChange={(e) => setendDate(e.target.value)}
                              data-kt-user-table-filter="search"
                              className="form-control bg-transparent w-100 ps-14"
                              // placeholder={intl.formatMessage({
                              //   id: 'GEN.SEARCH_BY_REF',
                              // })}
                              />
                          </div>
                          {/* end::Input group */}

                          {/* begin::Actions */}
                          <div className="d-flex justify-content-end">
                            <button
                              onClick={() => resetFilter()}
                              type="button"
                              className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                              data-kt-menu-dismiss="true"
                              data-kt-user-table-filter="reset"
                            >
                              {intl.formatMessage({ id: 'GEN.RESET' })}
                            </button>

                            <button
                              onClick={() => makeFilter()}
                              type="button"
                              className="btn btn-primary fw-bold px-6"
                              data-kt-menu-dismiss="true"
                              data-kt-user-table-filter="filter"
                            >
                              {intl.formatMessage({ id: 'GEN.APPLY' })}
                            </button>
                          </div>
                          {/* end::Actions */}
                        </div>
                        {/* end::Content */}
                      </div>
                      {/* end::SubMenu */}

                    </>
                  }

                  {/* begin::Import users */}
                  {
                    _canImportClaim &&
                    <button
                      type="button"
                      className="btn btn-secondary me-3"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_upload_users_file"
                      data-permission-guard={handleUserPermissionAccess('claims:read|claims:create')}
                      // onClick={()=> newClaim()}
                    >
                      <KTIcon iconName="file-up" className="fs-2" />
                      {intl.formatMessage({ id: 'GEN.IMPORT' })}{' '}
                      {intl.formatMessage({ id: 'CLAIMS.CLAIMS' })}
                    </button>
                  }
                  {/* end::Import users */}

                  {/* begin::Export users */}
                  <button
                    type="button"
                    className="btn btn-secondary me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_export_users_file"
                    data-permission-guard={handleUserPermissionAccess('claims:read') && _canExportClaim}
                    // onClick={()=> newClaim()}
                  >
                    <KTIcon iconName="file-down" className="fs-2" />
                    {intl.formatMessage({ id: 'GEN.EXPORT' })}{' '}
                    {intl.formatMessage({ id: 'CLAIMS.CLAIMS' })}
                  </button>
                  {/* end::Export users */}

                  {/* begin::Add user */}
                  <button
                    type="button"
                    className="btn btn-active-primary btn-primary"
                    onClick={() => newClaim()}
                    data-permission-guard={handleUserPermissionAccess('claims:create') && !IsAHolding() && _canAddClaim}
                  >
                    <KTIcon iconName="plus" className="fs-2" />
                    {intl.formatMessage({ id: 'CLAIM.ADD' })}
                  </button>
                  {/* end::Add user */}
                </div>
              </div>

              {/* end::Card toolbar */}
            </div>

            {/* <claimHeaderToolbarFilter/> */}
            <div className="card-body py-3">
              <div className="table-responsive">
                {/* <LongClaimsTable _claimsDatas={claimDatas} _listName={'IMCOMPLETE'} /> */}

                {!claimloader && claimDatas?.length >= 0 ? (
                  <LongClaimsTable
                    _claimsDatas={claimDatas}
                    _listName={'IMCOMPLETE'}
                  />
                ) : (
                  ''
                )}

                <div className="row">
                  {claimloader ? (
                    <h3 className="fw-bolder text-center col-12 mv-2rem">
                      {intl.formatMessage({ id: 'GEN.LOADING' })}
                    </h3>
                  ) : (
                    ''
                  )}

                  {!claimloader && claimDatas?.length == 0 ? (
                    <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                      🚫 {intl.formatMessage({ id: 'GEN.NO_DATAS' })}
                    </h3>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            <div className="card-footer">
              {/* begin::Card toolbar */}
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  {claimDatas?.length != 0 ? (
                    <div className="row">
                      <TablePagination
                        component="div"
                        count={totalItems}
                        page={page}
                        onPageChange={changePages}
                        rowsPerPage={rowsPerPageSize}
                        rowsPerPageOptions={rowsPerPageOptions}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              {/* end::Card toolbar */}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export { LongClaimsTableFilter };
