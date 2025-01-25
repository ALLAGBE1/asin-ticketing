/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG } from '../../../../_metronic/helpers';

import { ClaimModel } from '../core/models/Claim';
import { ClaimRequest } from '../core/services/ClaimRequest';
import { useNavigate } from 'react-router-dom';
import {
  capitalizeStr,
  closeModal,
  handleHttpError,
} from '../../../utils/functions';
import { Field } from 'formik';
import { ResponseChannelRequest } from '../../gestion-paramettres/core/services/ResponseChannelRequests';
import { StatusRequest } from '../../gestion-paramettres/core/services/StatusRequests';
import { ResponseChannelModel } from '../../gestion-paramettres/core/models/ResponseChannel';
import { StatusModel } from '../../gestion-paramettres/core/models/Status';
import { notificationErrorToast } from '../../../utils/notificationToasts';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();
const statusRequest = new StatusRequest();

const Claim: FC = () => {
  const intl = useIntl();

  const navigate = useNavigate();

  const [toDeleteValue, settoDeleteValue] = useState<ClaimModel | any>();

  const [loading, setLoading] = useState(false);
  const [claimloader, setclaimloader] = useState(true);
  const [claimDeleteloader, setclaimDeleteloader] = useState(false);

  let responseChannel: any;
  let status: any;

  const [ref, setref] = useState('');

  let page = 1;
  let size = 50;

  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );
  const [statusDatas, setstatusDatas] = useState(Array<StatusModel>);

  const newClaim = () => {
    navigate('/claims/new');
  };

  const goToClaimDetails = (data: ClaimModel | any) => {
    navigate('/claims/details/' + data.id);
  };

  const goToUpdate = (data: ClaimModel | any) => {
    navigate('/claims/update/' + data.id);
  };

  const selectResponseChannel = async ($event: any) => {
    console.log($event.target.value);
    responseChannel = $event.target.value;

    getClaims();
  };

  const selectStatus = ($event: any) => {
    console.log($event.target.value);
    status = $event.target.value;

    getClaims();
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

  const getStatusList = async () => {
    await statusRequest
      .getStatusList()
      .then((response: any) => {
        setstatusDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaims = async () => {
    setclaimloader(true);

    console.log(responseChannel, status, ref);

    await claimRequest
      .getClaimFilteredList(responseChannel, status, ref, page, size)
      .then((response: any) => {
        setclaimDatas(response.data.items);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteClaim = async () => {
    setclaimDeleteloader(true);

    await claimRequest
      .deleteClaim(toDeleteValue?.id)
      .then((response: any) => {
        getClaims();
        closeModal();
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getClaims();
    getResponseChannelList();
    getStatusList();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.CLAIM' })}
      </PageTitle>

      {/* delete product modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.DELETING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close"
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
                    {/* {intl.formatMessage({id: 'CLAIM.WOULD_YOU_WANNA_DELETE'})} : <span className="text-danger">{ toDeleteValue.libelle } </span> */}
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
                  onClick={() => deleteClaim()}
                >
                  {!claimDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'CLAIM.DELETE' })}
                    </span>
                  )}
                  {claimDeleteloader && (
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
              <div className="card-title align-items-start row w-100">
                {/* <div className='card-title align-items-start flex-column row w-100'> */}

                <div className="col-lg-3 mb-6">
                  <label className="form-label mb-3">
                    {intl.formatMessage({ id: 'GEN.RECEIVING_CANAL' })}
                  </label>

                  <select
                    className="form-control bg-transparent"
                    onChange={() => selectResponseChannel(event)}
                  >
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

                <div className="col-lg-3 mb-6">
                  <label className="form-label mb-3">
                    {intl.formatMessage({ id: 'GEN.STATUS' })}
                  </label>

                  <select
                    className="form-control bg-transparent"
                    onChange={() => selectStatus(event)}
                  >
                    <option>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({ id: 'GEN.STATUS' })}
                    </option>

                    {statusDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-lg-3 mb-6">
                  <label className="form-label mb-3">
                    {intl.formatMessage({ id: 'CLAIM.REFERENCE' })}
                  </label>

                  <input
                    type="text"
                    value={ref}
                    onChange={() => getClaims()}
                    placeholder={intl.formatMessage({ id: 'CLAIM.REFERENCE' })}
                    className="form-control bg-transparent"
                  />
                </div>

                <div className="col-lg-3 mb-6">
                  <button
                    type="button"
                    onClick={() => newClaim()}
                    className="form-control btn btn-primary _add_claim"
                  >
                    {intl.formatMessage({ id: 'CLAIM.ADD' })}
                  </button>
                </div>
              </div>

              {/* <div className='card-toolbar'>
  
                      <ul className='nav'>
                          <li className='nav-item'>
                              <button type="button" onClick={ ()=> newClaim() }
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_1"
                                  >
                                  {intl.formatMessage({id: 'CLAIM.ADD'})}
                              </button>
                          </li>
                      </ul>
  
                  </div> */}
            </div>

            <div className="card-body py-3">
              <div className="">
                <div className="" id="">
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                      <thead>
                        <tr className="border-0">
                          <th className="p-0 w-200px fw-bolder text-left">
                            Ref°
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'SETTINGS.INSTITUTION'})}</th> */}
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.COMPLAINT_OBJECT',
                            })}
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'CLAIM.TYPE'})}</th> */}
                          <th className="p-0 min-w-150px fw-bolder text-right">
                            {intl.formatMessage({ id: 'GEN.AMOUNT' })}
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.DESCRIPTION'})}</th>
                                      <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.EXPECT'})}</th>
                                      <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.RECEIVING_CANAL'})}</th>
                                      <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.RESPONSE_CANAL'})}</th> */}
                          <th className="p-0 min-w-150px fw-bolder text-center">
                            {intl.formatMessage({ id: 'GEN.STATUS' })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.IS_REPEAT' })}
                          </th>
                          {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'CLAIM.LOCATION_EVENT'})}</th> */}
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.CUSTOMER' })}
                          </th>
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {claimDatas?.map((row, index) => (
                          <tr key={index} className="claim_item">
                            <td className="text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{row.reference}</h5>
                                {/* <h5>#{row.reference}</h5> */}
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{row.institution.name}</h5>
                                                  <span>
                                                    {row.institution.acronym}
                                                   </span>
                                              </div>
                                          </td> */}

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.object.libelle}</h5>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{row.type.libelle}</h5>
                                              </div>
                                          </td> */}

                            <td className=" text-right">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>
                                  {row.amount} {row.currency.libelle}
                                </h5>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{row.description}</h5>
                                              </div>
                                          </td>
  
                                          <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{row.expect}</h5>
                                              </div>
                                          </td>
  
                                          <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{capitalizeStr(row.reception_channel.libelle)}</h5>
                                              </div>
                                          </td>
  
                                          <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{capitalizeStr(row.response_channel.libelle)}</h5>
                                              </div>
                                          </td> */}

                            <td className=" text-center">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5
                                  className={
                                    'status-' +
                                    capitalizeStr(row.status.libelle)
                                  }
                                >
                                  {capitalizeStr(row.status.libelle)}
                                </h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5
                                  className={
                                    row.is_reminder
                                      ? 'is-REMINDING'
                                      : 'no-REMINDING'
                                  }
                                >
                                  {row.is_reminder
                                    ? capitalizeStr(
                                        intl.formatMessage({ id: 'GEN.YES' }),
                                      )
                                    : capitalizeStr(
                                        intl.formatMessage({ id: 'GEN.NO' }),
                                      )}
                                </h5>
                              </div>
                            </td>

                            {/* <td className=' text-left'>
                                              <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                  <h5>{capitalizeStr(row.location_event)}</h5>
                                              </div>
                                          </td>
   */}
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <a href="#">
                                  <h5 className="text-primary">
                                    {row.customer.account_number}
                                  </h5>
                                  {/* <h5 className='text-primary'>{row.customer.customer_type.libelle} : {row.customer.account_number}</h5> */}
                                </a>
                              </div>
                            </td>

                            <td className=" text-left d-flex">
                              <a
                                onClick={() => goToClaimDetails(row)}
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'CLAIM.DETAILS',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-primary"
                              >
                                <KTIcon iconName="notepad" className="fs-1" />
                              </a>

                              <a
                                onClick={() => goToUpdate(row)}
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'CLAIM.UPDATE',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-warning ml-3"
                              >
                                <KTIcon
                                  iconName="notepad-edit"
                                  className="fs-1"
                                />
                              </a>

                              {/* <a
                                                  onClick={() => selectToDelete(row)}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#kt_modal_3"
                                                  title={intl.formatMessage({id: 'CLAIM.DELETE'})}
                                                  className='btn btn-sm btn-icon btn-bg-light btn-color-danger'
                                              >
                                                  <KTIcon iconName='trash' className='fs-1' />
                                              </a> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="row">
                      {claimloader && claimDatas?.length == 0 ? (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Claim };
