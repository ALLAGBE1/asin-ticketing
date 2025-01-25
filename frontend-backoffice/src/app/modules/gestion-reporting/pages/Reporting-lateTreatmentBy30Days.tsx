/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { FC, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import '../GestionReporting.css';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { getGenderAvatar, handleHttpError } from '../../../utils/functions';
import { Profile } from '../core/models/profile';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { LinearProgress } from '@mui/material';
import { ReportingRequests } from '../core/services/ReportingRequests';
import { ClaimModel } from '../../gestion-reclamation/core/models/Claim';
import { LongClaimsTable } from '../../gestion-reclamation/components/claimTables/longClaimsTable';
import { ReportFilter } from '../components/report-filter';
import CsvDownloadButton from 'react-json-to-csv';
import { KTIcon } from '../../../../_metronic/helpers';

let USER_DATAS: any;

const reportingRequests = new ReportingRequests();

const ReportingLateTreatmentBy30Days: FC = () => {
  const intl = useIntl();
  const [submitLoader, setsubmitLoader] = useState(false);
  const [userLoginLogsDatas, setuserLoginLogsDatas] = useState(Array<any>);

  const [claimloader, setclaimloader] = useState(true);
  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);

  const [categoryId, setcategoryId] = useState();
  const [objectId, setobjectId] = useState();
  const [unityId, setunityId] = useState();
  const [receptionChannelId, setreceptionChannelId] = useState();
  const [startDate, setstartDate] = useState();
  const [endDate, setendDate] = useState();

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'CLAIMS_REPORT.REPORT' }),
      path: '/reports/late-treatment/by/30',
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

  const getUnprocessedReportings = async () => {
    setclaimloader(true);

    await reportingRequests
      .getUnprocessedReportings()
      .then((response: any) => {
        // console.log(response.data)
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfCategory = async (_data: any) => {
    console.log(_data)
    setcategoryId(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(_data, objectId, unityId, receptionChannelId, startDate, endDate)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfObject = async (_data: any) => {
    console.log(_data)
    setobjectId(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(categoryId, _data, unityId, receptionChannelId, startDate, endDate)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfUnityId = async (_data: any) => {
    console.log(_data)
    setunityId(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(categoryId, unityId, _data, receptionChannelId, startDate, endDate)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfReceptionChannel = async (_data: any) => {
    console.log(_data)
    setreceptionChannelId(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(categoryId, objectId, unityId, _data, startDate, endDate)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfStartDate = async (_data: any) => {
    console.log(_data)
    setstartDate(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(categoryId, objectId, unityId, receptionChannelId, _data, endDate)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const applyFilterOfEndDate = async (_data: any) => {
    console.log(_data)
    setendDate(_data)
    setclaimloader(true);
    await reportingRequests
      .getUnprocessedReportings(categoryId, objectId, unityId, receptionChannelId, startDate, _data)
      .then((response: any) => {
        setclaimDatas(response.data);
        setclaimloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getUnprocessedReportings();
  }, []);


  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'CLAIMS_REPORT.REPORT_LATE_TREATMENT_30_DAYS' })}
      </PageTitle>

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
        <div className={`card mb-5 mb-xl-8`}>
          <div className="card-header">
            <ReportFilter
            _changeCategory={applyFilterOfCategory}
            _changeObject={applyFilterOfObject}
            _changeUnity={applyFilterOfUnityId}
            _changeReceptionChannel={applyFilterOfReceptionChannel}
            _changeStartDate={applyFilterOfStartDate}
            _changeEndDate={applyFilterOfEndDate}
            />
          </div>

            <div className="card-toolbar">
              <div
                className="d-flex justify-content-end"
                data-kt-user-table-toolbar="base"
              >


              <CsvDownloadButton
                  className="btn btn-light-primary me-3"
                  filename={intl.formatMessage({ id: 'CLAIMS_REPORT.REPORT_LATE_TREATMENT_30_DAYS'})}
                  delimiter=';'
                  headers={['Reference', 'Libelle', 'Objet', 'Category', 'Lieu', 'Description', 'Expérance', 'Montant','Est-ce un Rappel ?', 'Statut', 'Client']}
                  data={claimDatas.map((e:any, i:number) => {
                  return {
                    'Reference': e.reference,
                    'libelle': e.libelle,
                    'Objet': e.object.libelle,
                    'Category': e.object.category.libelle,
                    'Lieu': e.location_event,
                    'Description': e.description,
                    'Expérance': e.expect,
                    'Montant': e.amount,
                    'Est-ce un Rappel ?': e.is_reminder ? 'OUI' : 'NON',
                    'Statut': '--------',
                    'Client': `${e.customer?.profile?.first_name} ${e.customer?.profile?.last_name} | ${e.customer?.account_number}`
                  }
                } )}
                >
                  <KTIcon iconName="file-down" className="fs-2" />
                  {intl.formatMessage({ id: 'GEN.EXPORT' })}
                </CsvDownloadButton>

              </div>
            </div>
          {/* begin::Body */}
          <div className="card-body py-3">
              <div className="table-responsive">

                { claimloader && <LinearProgress /> }

                {!claimloader && claimDatas?.length >= 0 ? (
                  <LongClaimsTable
                    _claimsDatas={claimDatas}
                    // _listName={'IMCOMPLETE'}
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
          {/* begin::Body */}
        </div>
      </div>
    </>
  );
};

export { ReportingLateTreatmentBy30Days };
