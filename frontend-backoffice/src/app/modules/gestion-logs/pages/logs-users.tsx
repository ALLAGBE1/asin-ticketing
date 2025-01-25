/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { FC, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import '../GestionLogs.css';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import {
  dateWithMinutes,
  formatDateToNumeric,
  getGenderAvatar,
  handleHttpError,
} from '../../../utils/functions';
import { Profile } from '../core/models/profile';
import { LogsRequest } from '../core/services/LogsRequests';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { LinearProgress, TablePagination } from '@mui/material';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { IsAHolding } from '../../../utils/permissionAccessHandler';
import { InstitutionRequest } from '../../gestion-paramettres/core/services/InstitutionRequests';
import { InstitutionModel } from '../../gestion-paramettres/core/models/Institution';
import { KTIcon } from '../../../../_metronic/helpers';

let USER_DATAS: any;

const logRequests = new LogsRequest();
const institutionRequest = new InstitutionRequest();

const LogsUsers: FC = () => {
  const [page, setpage] = useState(0);
  const [rowsPerPageSize, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
  const [totalItems, settotalItems] = useState(0);

  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const userConectedInstitutionId = user_datas.unity.institution.id;

  const [ref, setref] = useState('');

  const intl = useIntl();
  const [gettingLogsLoader, setgettingLogsLoader] = useState(false);
  const [submitLoader, setsubmitLoader] = useState(false);
  const [userLoginLogsDatas, setuserLoginLogsDatas] = useState(Array<any>);

  const [institutionDatas, setinstitutionDatas] = useState<any>(
    Array<InstitutionModel>,
  );

  const [filteredInstitution, setfilteredInstitution] = useState<any>(
    IsAHolding() ? null : userConectedInstitutionId,
  );

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'SETTINGS.LOGS' }),
      path: '/logs/users-list',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ];

  const getUsersLoginLogsFilteredByNameAndEmail = async (_ref: string) => {
    setgettingLogsLoader(true);
    setref(_ref);

    await logRequests
      .getUsersLoginLogs(1, 10, filteredInstitution, null, _ref)
      .then((response: any) => {
        console.log(response.data);
        settotalItems(response.data.total);
        setuserLoginLogsDatas(response.data.items);
        setgettingLogsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUsersLoginLogs = async (
    filtered_Institution = filteredInstitution,
  ) => {
    setgettingLogsLoader(true);

    await logRequests
      .getUsersLoginLogs(1, 10, filtered_Institution, null, ref)
      .then((response: any) => {
        console.log(response.data);
        settotalItems(response.data.total);
        setuserLoginLogsDatas(response.data.items);
        setgettingLogsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const handleChangeRowsPerPage = async (event: any) => {
    setgettingLogsLoader(true);

    const rowsPerPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPageSize);
    setpage(1);

    await logRequests
      .getUsersLoginLogs(page, rowsPerPageSize, filteredInstitution, null,  ref)
      .then((response: any) => {
        setuserLoginLogsDatas(response.data.items);
        setgettingLogsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const changePages = async (event: any, value: any) => {
    console.log(value);

    setgettingLogsLoader(true);
    setpage(value);

    await logRequests
      .getUsersLoginLogs(value, rowsPerPageSize, filteredInstitution, null, ref)
      .then((response: any) => {
        setuserLoginLogsDatas(response.data.items);
        setgettingLogsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const changeInstitutionFilter = (event: any) => {
    console.log(event.target.value);

    const institution_id = event.target.value;
    setfilteredInstitution(institution_id);
    getUsersLoginLogs(institution_id);
  };

  const getInstitutionList = async () => {
    await institutionRequest
      .getInstitutionList()
      .then((response: any) => {
        setinstitutionDatas(
          response.data.items.filter(
            (e: any) => e.institution_type.libelle != 'HOLDING',
          ),
        );
        console.log(institutionDatas);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getUsersLoginLogs();
    getInstitutionList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'SETTINGS.USER_LOGIN_LOGS' })}
      </PageTitle>

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">

        <div className={`card mb-5 mb-xl-8`}>

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
                  onChange={(e) =>
                    getUsersLoginLogsFilteredByNameAndEmail(e.target.value)
                  }
                  data-kt-user-table-filter="search"
                  className="form-control bg-transparent w-300px ps-14"
                  placeholder={'Recherche...'}
                />
              </div>
              {/* end::Search */}
            </div>

            <div className="card-toolbar">

              <div className="w-100 d-flex justify-content-end">

                {IsAHolding() && (
                  <>

                    {gettingLogsLoader ? (
                      <LOADER_INPUTLOADER />
                    ) : (
                      <>
                        <select
                          className="col-3 form-control w-auto bg-transparent me-3"
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
                      </>
                    )}
                    {/* <div
                    className="d-flex justify-content-end"
                    data-kt-user-table-toolbar="base"
                  >
                  </div> */}

                  </>

                )}

              </div>
            </div>
          </div>

          {/* begin::Body */}
          <div className="card-body py-3">
            {/* begin::Table container */}
            <div className="table-responsive">
              {gettingLogsLoader && <LinearProgress color="primary" />}

              {/* begin::Table */}
              <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                {/* begin::Table head */}
                <thead>
                  <tr className="fw-bold text-muted">
                    <th className="min-w-250px">User</th>
                    <th className="min-w-140px">Role</th>
                    <th className="min-w-140px">Unité</th>

                    {IsAHolding() && <th className="min-w-140px">Filiale</th>}

                    <th className="min-w-140px">Date</th>
                    <th className="min-w-120px">Adresse IP</th>
                    <th className="min-w-120px">Ressource</th>
                    <th className="min-w-120px">Description de l'action</th>
                    {/* <th className="min-w-100px">Date</th> */}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {userLoginLogsDatas?.map((row, index) => (
                    <>
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-45px me-5">
                              <img
                                src={getGenderAvatar(row.user?.profile?.sex)}
                                alt={
                                  row.user?.profile?.first_name +
                                  ' ' +
                                  row.user?.profile?.last_name
                                }
                              />
                            </div>
                            <div className="d-flex justify-content-start flex-column">
                              <a
                                href=""
                                className="text-gray-900 fw-bold text-hover-primary fs-6"
                              >
                                {row.user?.profile?.first_name}{' '}
                                {row.user?.profile?.last_name}
                              </a>
                              <span className="text-muted fw-semibold text-muted d-block fs-16">
                                <a
                                  href={
                                    row.user?.profile?.email
                                      ? 'mailto:' + row.user?.profile?.email
                                      : ''
                                  }
                                >
                                  {row.user?.profile?.email
                                    ? row.user?.profile?.email
                                    : ''}
                                </a>
                              </span>
                              <span className="text-muted fw-semibold text-muted d-block fs-16">
                                <a
                                  href={
                                    row.user?.profile?.telephone
                                      ? 'tel:' + row.user?.profile?.telephone
                                      : ''
                                  }
                                >
                                  {row.user?.profile?.telephone
                                    ? row.user?.profile?.telephone
                                    : ''}
                                </a>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                            {row.user?.roles[0].name}
                            {row.user?.roles[1] && (
                              <>
                                ,
                                <span className="badge badge-light-success mr-1">
                                  +1
                                </span>
                              </>
                            )}
                          </a>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            <span className="text-warning">
                              {row.user?.fonction}
                            </span>
                          </span>
                        </td>
                        <td className="w-70">
                          <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                            {row.user?.unity?.unity_type?.libelle}
                          </a>
                        </td>

                        {IsAHolding() && (
                          <td>
                            <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                              {row.user.unity?.institution
                                ? row.user.unity?.institution.name
                                : '--'}
                            </a>
                          </td>
                        )}

                        <td>
                          <span className="badge">
                            {dateWithMinutes(row.created_at)}
                          </span>
                        </td>
                        <td>
                          <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                            {row.user_ip}
                          </a>
                        </td>
                        <td>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            {row.path ? row.path + ', ' : ' '}
                            <span className="text-danger">
                              {row.process_time
                                ? ' in ' + row.process_time + ' '
                                : ' '}
                            </span>
                          </span>
                        </td>
                        <td>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            {row.description ? row.description : ' '}
                          </span>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
                {/* end::Table body */}
              </table>
              {/* end::Table */}

              <div className="row">
                {gettingLogsLoader && userLoginLogsDatas.length == 0 ? (
                  <h3 className="fw-bolder text-center col-12 mv-2rem">
                    {intl.formatMessage({ id: 'GEN.LOADING' })}
                  </h3>
                ) : (
                  ''
                )}

                {!gettingLogsLoader && userLoginLogsDatas.length == 0 ? (
                  <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                    🚫 {intl.formatMessage({ id: 'GEN.NO_DATAS' })}
                  </h3>
                ) : (
                  ''
                )}
              </div>
            </div>
            {/* end::Table container */}
          </div>
          {/* begin::Body */}

          <div className="card-footer">
            {/* begin::Card toolbar */}
            <div className="card-toolbar">
              <div
                className="d-flex justify-content-end"
                data-kt-user-table-toolbar="base"
              >
                {userLoginLogsDatas?.length != 0 ? (
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
    </>
  );
};

export { LogsUsers };
