/* eslint-disable react-hooks/rules-of-hooks */
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
import { LongClaimsTable } from '../claimTables/longClaimsTable';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../../utils/functions';
import clsx from 'clsx';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();

const claimHeaderToolbarFilter: FC<any> = (props: any) => {
  const intl = useIntl();

  const navigate = useNavigate();

  const [responseChannelId, setResponseChannelId] = useState<number | any>();

  const [ref, setref] = useState('');

  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const [claimloader, setclaimloader] = useState(true);

  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );

  const [page, setpage] = useState(1);
  const [rowsPerPageSize, setRowsPerPage] = useState(30);
  const [totalItems, settotalItems] = useState(0);

  const [userImporterFile, setuserImporterFile] = useState();
  const [userImportLoader, setuserImportLoader] = useState(false);

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
  };

  const resetFilter = async () => {
    setResponseChannelId(0);
    setref('');

    console.log(responseChannelId, ref);

    setTimeout(async () => {
      await claimRequest
        .getClaimFilteredList(responseChannelId, 1, ref, page, rowsPerPageSize)
        .then((response: any) => {
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

    console.log(responseChannelId, ref);

    await claimRequest
      .getClaimFilteredList(responseChannelId, 1, ref, page, rowsPerPageSize)
      .then((response: any) => {
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
      .getClaimFilteredList(null, 1, null, page, rowsPerPageSize)
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
      .getClaimFilteredList(null, 1, null, value, rowsPerPageSize)
      .then((response: any) => {
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
      .getClaimFilteredList(null, 1, null, page, rowsPerPageSize)
      .then((response: any) => {
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

    console.log(responseChannelId, ref);

    await claimRequest
      .getClaimFilteredList(responseChannelId, 1, _ref, page, rowsPerPageSize)
      .then((response: any) => {
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

  useEffect(() => {
    getClaims();
    getResponseChannelList();

    MenuComponent.reinitialization();
  }, []);

  return (
    <>
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
                    {intl.formatMessage({ id: 'CLAIMS.UPLOADING_CLAIMS' })}
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
                    <label className="required form-label fs-6 fw-bolder text-gray-900">
                      {intl.formatMessage({ id: 'GEN.SELECT_FILE' })}
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
                    onClick={() => closeModal('modal_close-formikUploadFile')}
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
                        {intl.formatMessage({ id: 'GEN.IMPORT' })}
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
                    {intl.formatMessage({ id: 'CLAIMS.EXPORTING_CLAIMS' })}
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
                    onClick={() => closeModal('modal_close-formikExportFile')}
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
              onChange={(e) => getClaimsFilteredByRef(e.target.value)}
              data-kt-user-table-filter="search"
              className="form-control bg-transparent w-300px ps-14"
              placeholder={intl.formatMessage({ id: 'GEN.SEARCH_BY_REF' })}
            />
          </div>
          {/* end::Search */}
        </div>

        {/* begin::Card toolbar */}
        <div className="card-toolbar">
          <div
            className="d-flex justify-content-end"
            data-kt-user-table-toolbar="base"
          >
            {/* begin::Filter Button */}
            <button
              type="button"
              className="btn btn-secondary me-3"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
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
                    {intl.formatMessage({ id: 'GEN.RECEIVING_CANAL' })} :
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

                    <option>
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

            {/* begin::Import users */}
            <button
              type="button"
              className="btn btn-secondary me-3"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_upload_users_file"
              // onClick={()=> newClaim()}
            >
              <KTIcon iconName="file-up" className="fs-2" />
              {intl.formatMessage({ id: 'GEN.IMPORT' })}{' '}
              {intl.formatMessage({ id: 'CLAIMS.CLAIMS' })}
            </button>
            {/* end::Import users */}

            {/* begin::Export users */}
            <button
              type="button"
              className="btn btn-secondary me-3"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_export_users_file"
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
            >
              <KTIcon iconName="plus" className="fs-2" />
              {intl.formatMessage({ id: 'CLAIM.ADD' })}
            </button>
            {/* end::Add user */}
          </div>
        </div>

        {/* end::Card toolbar */}
      </div>
    </>
  );
};

export { claimHeaderToolbarFilter };
