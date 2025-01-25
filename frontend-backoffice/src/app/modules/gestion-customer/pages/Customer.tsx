/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { getGenderAvatar, handleHttpError } from '../../../utils/functions';
import clsx from 'clsx';
import { LinearProgress, TablePagination } from '@mui/material';
import { ProfileRequest } from '../../gestion-profile/core/services/ProfileRequests';
import '../GestionCustomer.css';
import { AdminUserAccountRequest } from '../../gestion-utilisateurs/core/services/adminUserAccountRequest';
import { CustomerRequest } from '../core/services/CustomerRequests';
import { InstitutionRequest } from '../../gestion-paramettres/core/services/InstitutionRequests';
import { InstitutionModel } from '../../gestion-paramettres/core/models/Institution';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { IsAHolding } from '../../../utils/permissionAccessHandler';

const adminUsersAccountRequest = new AdminUserAccountRequest();
const customerRequest = new CustomerRequest();
const institutionRequest = new InstitutionRequest();

const Customer: FC = () => {
  const intl = useIntl();

  const USERDATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const USERDATAS = JSON.parse(localStorage.getItem(USERDATAS_KEY));

  const userConectedInstitutionId = USERDATAS.unity.institution.id;

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'MANAGEMENT.USERS' }),
      path: '/customers/list',
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

  const [customerAcountDatasloader, setcustomerAcountDatasloader] =
    useState(true);
  const [customerAccountsDatas, setcustomerAccountsDatas] = useState(
    Array<any>,
  );

  const [filteredRole, setfilteredRole] = useState(2);

  const [page, setpage] = useState(0);
  const [rowsPerPageSize, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
  const [totalItems, settotalItems] = useState(0);

  const [institutionDatas, setinstitutionDatas] = useState<any>(
    Array<InstitutionModel>,
  );

  const [filteredInstitution, setfilteredInstitution] = useState<any>(
    IsAHolding() ? null : userConectedInstitutionId,
  );

  const changePages = async (event: any, value: any) => {
    console.log(value);

    setcustomerAcountDatasloader(true);
    setpage(value);

    await customerRequest
      .getCustumerList(value, rowsPerPageSize, filteredInstitution)
      .then((response: any) => {
        // console.log(response.data)
        setcustomerAccountsDatas(response.data.items);
        setcustomerAcountDatasloader(false);
        settotalItems(response.data.total);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const handleChangeRowsPerPage = async (event: any) => {
    setcustomerAcountDatasloader(true);

    const _rowsPerPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPageSize);
    setpage(1);

    await customerRequest
      .getCustumerList(page, _rowsPerPageSize, filteredInstitution)
      .then((response: any) => {
        // console.log(response.data)
        setcustomerAccountsDatas(response.data.items);
        setcustomerAcountDatasloader(false);
        settotalItems(response.data.total);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const changeInstitutionFilter = (event: any) => {
    console.log(event.target.value);

    const institution_id = event.target.value;
    setfilteredInstitution(institution_id);
    getCustomerList(institution_id);
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

  const getCustomerList = async (
    filtered_Institution = filteredInstitution,
  ) => {
    setcustomerAcountDatasloader(true);

    await customerRequest
      .getCustumerList(page, rowsPerPageSize, filtered_Institution)
      .then((response: any) => {
        console.log(response.data)
        setcustomerAccountsDatas(response.data.items);
        setcustomerAcountDatasloader(false);
        settotalItems(response.data.total);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getCustomerList();
    getInstitutionList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'USER.CUSTOMER_LIST' })}
      </PageTitle>

      <div className={`card mb-5 mb-xl-8`}>

        {IsAHolding() && (
          <div className="card-header border-0 pt-6">
            <div className="w-100 d-flex justify-content-end">
              {customerAcountDatasloader ? (
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
            </div>
          </div>
        )}

        {/* begin::Body */}
        <div className="card-body py-3">
          {/* begin::Table container */}
          <div className="table-responsive">
            {customerAcountDatasloader && <LinearProgress color="primary" />}

            {/* begin::Table */}
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              {/* begin::Table head */}
              <thead>
                <tr className="fw-bold text-muted">
                  <th className="min-w-250px">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.CUSTOMER' })}
                  </th>
                  <th className="min-w-100px">
                    {intl.formatMessage({ id: 'GEN.CONTACT' })}
                  </th>
                  <th className="min-w-100px">
                    {intl.formatMessage({ id: 'GEN.ADRESSE' })}
                  </th>
                  <th className="min-w-140px">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.ACCOUNT_NUMBER' })}
                  </th>
                  <th className="min-w-120px">
                    {intl.formatMessage({ id: 'USER_ACCOUNT.CUSTOMER_TYPE' })}
                  </th>

                    {IsAHolding() && <th className="min-w-140px">Filiale</th>}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {customerAccountsDatas?.map((row, index) => (
                  <>
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-45px me-5">
                            <img
                              src={getGenderAvatar(row.profile?.sex)}
                              alt=""
                            />
                          </div>
                          <div className="d-flex justify-content-start flex-column">
                            <a className="text-gray-900 fw-bold text-hover-primary fs-6">
                              {row.profile?.first_name}
                            </a>
                            <a className="text-gray-900 fw-bold text-hover-primary fs-6">
                              {row.profile?.last_name}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        {row.profile?.email && (
                          <a
                            href={
                              row.profile?.email
                                ? 'mailto:' + row.profile?.email
                                : '#'
                            }
                            className="text-gray-900 fw-bold text-hover-primary d-block fs-6"
                          >
                            {row.profile?.email ? row.profile?.email : ''}
                          </a>
                        )}

                        {row.profile?.telephone && (
                          <a
                            href={
                              row.profile?.telephone
                                ? 'tel:' + row.profile?.telephone
                                : '#'
                            }
                            className="text-gray-900 fw-bold text-hover-primary d-block fs-6"
                          >
                            {row.profile?.telephone
                              ? row.profile?.telephone
                              : ''}
                          </a>
                        )}
                      </td>
                      <td>
                        <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                          {row.profile?.department
                            ? row.profile.department
                            : '--'}
                        </a>

                        <span className="text-muted fw-semibold text-muted d-block fs-7">
                          {row.profile?.city ? row.profile.city : '--'} /{' '}
                          {row.profile?.address ? row.profile.address : '--'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-light-success">
                          {row.account_number ? row.account_number : '--'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={clsx(
                            'badge',
                            // {'badge-light-success': row.is_active},
                            // {
                            // 'badge-light-danger': !row.is_active,
                            // }
                          )}
                        >
                          {row.customer_type ? row.customer_type.libelle : '--'}
                        </span>
                      </td>

                        {IsAHolding() && (
                          <td>
                            <a className="text-gray-900 fw-bold text-hover-primary d-block fs-6">
                              {row?.institution
                                ? row?.institution.name
                                : '--'}
                            </a>
                          </td>
                        )}
                    </tr>
                  </>
                ))}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}

            <div className="row">
              {customerAcountDatasloader &&
              customerAccountsDatas.length == 0 ? (
                <h3 className="fw-bolder text-center col-12 mv-2rem">
                  {intl.formatMessage({ id: 'GEN.LOADING' })}
                </h3>
              ) : (
                ''
              )}

              {!customerAcountDatasloader &&
              customerAccountsDatas.length == 0 ? (
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
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              {customerAccountsDatas?.length != 0 ? (
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
        </div>
      </div>
    </>
  );
};

export { Customer };
