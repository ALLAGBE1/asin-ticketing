/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { Dropdown1 } from '../../../../../_metronic/partials';
import { LogsRequest } from '../../../gestion-logs/core/services/LogsRequests';
import { formatDateToNumeric, getGenderAvatar, handleHttpError } from '../../../../utils/functions';
import { useParams } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { useIntl } from 'react-intl';

// type Props = {
//   className: string
// }

const logRequests = new LogsRequest();

const UserLogsList: React.FC = () => {

  const [gettingLogsLoader, setgettingLogsLoader] = useState(false);
  const [submitLoader, setsubmitLoader] = useState(false);
  const [userLoginLogsDatas, setuserLoginLogsDatas] = useState(Array<any>);

  const intl = useIntl();

  const userId: any = useParams()['user_id'];

  const getUsersLoginLogs = async () => {
    setgettingLogsLoader(true);

    await logRequests
      .getUsersLoginLogs(1, 10, null, userId)
      .then((response: any) => {
        console.log(response.data);
        // settotalItems(response.data.total)
        setuserLoginLogsDatas(response.data.items);
        setgettingLogsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getUsersLoginLogs();
  }, []);

  return (
    <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <div className={`card mb-5 mb-xl-8`}>
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
                    <th className="min-w-140px">Date</th>
                    <th className="min-w-120px">Adresse IP</th>
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
                                alt={row.user?.profile?.first_name + ' ' + row.user?.profile?.last_name}
                              />
                            </div>
                            <div className="d-flex justify-content-start flex-column">
                              <a
                                href=""
                                className="text-gray-900 fw-bold text-hover-primary fs-6"
                              >
                                {row.user?.profile?.first_name}{' '}
                                {row.user?.profile?.last_name}{', '}<span className="text-warning">{row.user?.fonction}</span>
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
                            {
                              row.user?.roles[1] &&
                              <>
                                ,
                                <span className="badge badge-light-success mr-1">
                                  +1
                                </span>
                              </>
                            }
                          </a>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            { row.user?.unity?.institution?.name }, { row.user?.unity?.unity_type?.libelle }
                          </span>
                        </td>
                        <td>
                          <span className="badge">
                            { formatDateToNumeric(row.created_at) }
                          </span>
                        </td>
                        <td>
                          <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                            {row.user_ip}
                          </a>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            {/* <span className="badge badge-light-success mr-1">
                              {row.status_code}
                            </span> */}
                            {row.path
                              ? row.path + ', '
                              : ' '}
                              in
                              <span className='text-danger'>
                              {row.process_time
                              ?  ' ' + row.process_time + ' '
                              : ' '}
                              </span>
                          </span>
                          <span className="text-muted fw-semibold text-muted d-block fs-16">
                            {row.description
                              ? row.description
                              : ' '}
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

            {/* <div className="card-footer">
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

            </div> */}

        </div>
      </div>
  );
};

export { UserLogsList };
