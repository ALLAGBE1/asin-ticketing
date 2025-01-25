/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useNavigate, useParams } from 'react-router-dom';
import { TablePagination } from '@mui/material';
import { ResponseChannelRequest } from '../../../gestion-paramettres/core/services/ResponseChannelRequests';
import { ClaimModel } from '../../../gestion-reclamation/core/models/Claim';
import { ResponseChannelModel } from '../../../gestion-paramettres/core/models/ResponseChannel';
import { ClaimRequest } from '../../../gestion-reclamation/core/services/ClaimRequest';
import { MenuComponent } from '../../../../../_metronic/assets/ts/components';
import { PageTitle } from '../../../../../_metronic/layout/core';
import { KTIcon } from '../../../../../_metronic/helpers';
import { LongClaimsTable } from '../../../gestion-reclamation/components/claimTables/longClaimsTable';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { handleHttpError } from '../../../../utils/functions';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();

const UserClaims: FC = () => {
  const intl = useIntl();

  const navigate = useNavigate();

  const userId: any = useParams()['user_id'];

  const [claimloader, setclaimloader] = useState(true);

  const [ref, setref] = useState('');

  const [responseChannelId, setResponseChannelId] = useState<number | any>();

  const [page, setpage] = useState(1);
  const [totalItems, settotalItems] = useState(0);

  const [rowsPerPageSize, setRowsPerPage] = useState(5);

  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );


  const resetFilter = async () => {
    setResponseChannelId(0);
    setref('');

    console.log(responseChannelId, ref);

    setTimeout(async () => {
      await claimRequest
        .getClaimFilteredListByAllOptions(responseChannelId, null, null, null, userId, null, null, 2, ref, page, rowsPerPageSize)
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
      .getClaimFilteredListByAllOptions(responseChannelId, null, null, null, userId, null, null, 2, ref, page, rowsPerPageSize)
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
      .getClaimFilteredListByAllOptions(null, null, null, null, userId, null, null, 2, null, page, rowsPerPageSize)
      .then((response: any) => {
        console.log(response.data);
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
      .getClaimFilteredListByAllOptions(null, null, null, null, userId, null, null, 2, null, value, rowsPerPageSize)
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
      .getClaimFilteredListByAllOptions(null, null, null, null, userId, null, null, 2, null, page, rowsPerPageSize)
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
      .getClaimFilteredListByAllOptions(responseChannelId, null, null, null, userId, null, null, 2, _ref, page, rowsPerPageSize)
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
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'CLAIM.NOT_COMPLETE'})}</PageTitle> */}

      {/* complaint categories list */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-6">
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
                    placeholder={intl.formatMessage({
                      id: 'GEN.SEARCH_BY_REF',
                    })}
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
                    className="btn btn-light-primary me-3"
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
                </div>
              </div>

              {/* end::Card toolbar */}
            </div>

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
                        rowsPerPageOptions={[5, 10, 20]}
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

export { UserClaims };
