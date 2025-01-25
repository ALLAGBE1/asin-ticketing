/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { ClaimModel } from '../../core/models/Claim';
import { useNavigate } from 'react-router-dom';
import { capitalizeStr, formatDateToNumeric } from '../../../../utils/functions';
import { KTIcon } from '../../../../../_metronic/helpers';

const LongClaimsTable: FC<any> = (props: any) => {
  const intl = useIntl();
  const months = [
    {
      name: "DATE.MONTH.JAN",
      value: 1,
    },
    {
      name: "DATE.MONTH.FEB",
      value: 2,
    },
    {
      name: "DATE.MONTH.MAR",
      value: 3,
    },
    {
      name: "DATE.MONTH.APR",
      value: 4,
    },
    {
      name: "DATE.MONTH.MAY",
      value: 5,
    },
    {
      name: "DATE.MONTH.JUN",
      value: 6,
    },
    {
      name: "DATE.MONTH.JUL",
      value: 7,
    },
    {
      name: "DATE.MONTH.AUG",
      value: 8,
    },
    {
      name: "DATE.MONTH.SEP",
      value: 9,
    },
    {
      name: "DATE.MONTH.OCT",
      value: 10,
    },
    {
      name: "DATE.MONTH.NOV",
      value: 11,
    },
    {
      name: "DATE.MONTH.DEC",
      value: 12,
    },
  ];
  

  const navigate = useNavigate();

  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const goToClaimDetails = (data: ClaimModel | any) => {
    navigate('/claims/details/' + data.id);
  };

  const goToUpdate = (data: ClaimModel | any) => {
    navigate('/claims/update/' + data.id);
  };

  useEffect(() => {
    setclaimDatas(props._claimsDatas);
    console.log(props._claimsDatas);
  }, []);

  return (
    <>
      <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
        <thead>
          <tr className="border-0">
            <th className="p-0 min-w-150px w-50px fw-bolder text-left">Ref°</th>
            <th className="p-0 min-w-150px fw-bolder text-left">
              {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-left">
              {intl.formatMessage({ id: 'CLAIM.LOCATION_EVENT' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-right">
              {intl.formatMessage({ id: 'GEN.AMOUNT' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-right">
              {intl.formatMessage({ id: 'CLAIM.DATE_CLAIM_RECORDING' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-right">
              {intl.formatMessage({ id: 'CLAIM.DATE_CLAIM_REPORT' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-center">
              {intl.formatMessage({ id: 'SETTINGS.STATUS' })}
            </th>
            {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.IS_REPEAT'})}</th> */}
            <th className="p-0 min-w-150px fw-bolder text-left">
              {intl.formatMessage({ id: 'GEN.CUSTOMER' })}
            </th>
            <th className="p-0 min-w-50px fw-bolder text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {claimDatas?.map((row, index) => (
            row.customer?.profile &&
            <tr key={index} className="claim_item">
              <td className="w-600 text-left">
                <div className="symbol symbol-45px me-2">
                  <h5>{row?.reference}</h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{row?.object?.libelle}</h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{row?.location_event}</h5>
                </div>
              </td>

              <td className=" text-right">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>
                    {row?.amount} {row?.currency?.libelle}
                  </h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{ new Date(row?.created_at).getDate() }, { intl.formatMessage({  id: months.filter((e:any) => e.value == new Date(row?.created_at).getMonth() + 1 )[0]?.name })  }, { new Date(row?.created_at).getFullYear() }</h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{ new Date(row?.date_claim).getDate() }, { intl.formatMessage({  id: months.filter((e:any) => e.value == new Date(row?.date_claim).getMonth() + 1 )[0]?.name })  }, { new Date(row?.date_claim).getFullYear() }</h5>
                </div>
              </td>

              <td className=" text-center">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5 className={'status-' + capitalizeStr(row?.status?.libelle)}>
                    {intl.formatMessage({
                      id: `CLAIMS_STATUS.${row?.status?.libelle}`,
                    })}
                  </h5>
                </div>
              </td>

              {/* <td className=' text-left'>
                            <div className='symbol symbol-45px me-2 text-hover-primary'>
                                <h5 className={row?.is_reminder ? 'is-REMINDING' : 'no-REMINDING'}>{row?.is_reminder ? capitalizeStr(intl.formatMessage({id: 'GEN.YES'})) : capitalizeStr(intl.formatMessage({id: 'GEN.NO'}))}</h5>
                            </div>
                        </td> */}

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <a href="">
                    <h5 className="text-primary">
                      {row?.customer?.profile?.first_name}{' '}
                      {row?.customer?.profile?.last_name} |{' '}
                      {row?.customer?.account_number}
                    </h5>
                  </a>
                </div>
              </td>

              <td className=" text-left d-flex">
                <a
                  onClick={() => goToClaimDetails(row)}
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_2"
                  title={intl.formatMessage({ id: 'CLAIM.DETAILS' })}
                  className="btn btn-sm btn-icon btn-bg-light btn-color-primary"
                >
                  <KTIcon iconName="notepad" className="fs-1" />
                </a>

                {/* {row?.status?.id == 1 && (
                  <a
                    onClick={() => goToUpdate(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_2"
                    title={intl.formatMessage({ id: 'CLAIM.UPDATE' })}
                    className="btn btn-sm btn-icon btn-bg-light btn-color-warning ml-3"
                  >
                    <KTIcon iconName="notepad-edit" className="fs-1" />
                  </a>
                )} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { LongClaimsTable };
