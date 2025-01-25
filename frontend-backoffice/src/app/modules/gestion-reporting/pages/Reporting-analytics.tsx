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
import { formatDateToNumeric, getGenderAvatar, handleHttpError } from '../../../utils/functions';
import { Profile } from '../core/models/profile';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { LinearProgress } from '@mui/material';
import { ReportingRequests } from '../core/services/ReportingRequests';
import { ROUNDED_LOADER } from '../../../utils/contents-loader/ROUNDED_LOADER';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { KTIcon } from '../../../../_metronic/helpers';

import CsvDownloadButton from 'react-json-to-csv'

const reportingRequests = new ReportingRequests();

const ReportingAnalytics: FC = () => {
  const intl = useIntl();
  const [gettingReportingAnalyticsLoader, setgettingReportingAnalyticsLoader] = useState(false);
  const [submitLoader, setsubmitLoader] = useState(false);
  const [reportingAnalyticsDatas, setreportingAnalyticsDatas] = useState<any>();

  const [startDate, setstartDate] = useState<any>();
  const [endDate, setendDate] = useState<any>(new Date());

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'CLAIMS_REPORT.REPORT' }),
      path: '/reports/analytics',
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

  const getReportingAnalitics = async (_startDate?:string | Date | any, _endDate:string | Date | any = endDate) => {

    setgettingReportingAnalyticsLoader(true);

    if(_startDate) setstartDate(startDate)
    if(_endDate) setendDate(endDate)

    await reportingRequests
      .getReportingsAnalitics(_startDate, _endDate)
      .then((response: any) => {
        // console.log(response.data.filter(
        //   (item: any) =>{
        //     return item.nb_claims != 0
        //   }
        // ));
        setreportingAnalyticsDatas(
          response.data.filter(
            (item: any) =>{
              return item.nb_claims != 0
            }
          )
        );
        setgettingReportingAnalyticsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getReportingAnalitics();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'CLAIMS_REPORT.ANALYTICS' })}
      </PageTitle>

      <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">

        <div className="card-header">

            <div className="container mt-8">

                <div className="row">

                    <div className="fv-row mb-8 col-md-6 col-lg-4">
                        <label className="form-label fs-6 fw-bolder text-gray-900">
                            {intl.formatMessage({ id: 'CLAIMS_REPORT.START_DATE' })}
                        </label>
                        <input type="date" className="form-control bg-transparent"
                                  // value={startDate.toISOString()}
                                  onChange={ (e) => getReportingAnalitics(e.target.value, endDate.toISOString())}
                                  placeholder={intl.formatMessage({ id: 'CLAIMS_REPORT.START_DATE' })}/>
                    </div>

                    <div className="fv-row mb-8 col-md-6 col-lg-4">
                        <label className="form-label fs-6 fw-bolder text-gray-900">
                            {intl.formatMessage({ id: 'CLAIMS_REPORT.END_DATE' })}
                        </label>
                        <input type="date" className="form-control bg-transparent"
                                  // value={endDate.toISOString()}
                                  onChange={ (e) => getReportingAnalitics(endDate.toISOString(), e.target.value)}
                                  placeholder={intl.formatMessage({ id: 'CLAIMS_REPORT.END_DATE' })}/>
                    </div>

                </div>

            </div>
        </div>

        {/* begin::Body */}
        <div className="card-body py-3">

            {/* begin::Table container */}

                <div className="row my-8">

                  <div className="col-12">

                    { gettingReportingAnalyticsLoader && <LinearProgress /> }

                    <div className={`card card-flush`} style={{height: '100%'}}>

                      <div className="card-header border-0 pt-6">

                        <div className="card-title">
                          <div className="d-flex align-items-center position-relative my-1">
                              {intl.formatMessage({
                                id: 'CLAIMS_REPORT.CONCERNED_CATEGORY_LIST'
                              })}
                          </div>
                        </div>

                        <div className="card-toolbar">
                          <div
                            className="d-flex justify-content-end"
                            data-kt-user-table-toolbar="base"
                          >

                          <CsvDownloadButton
                              className="btn btn-light-primary me-3"
                              filename={intl.formatMessage({ id: 'CLAIMS_REPORT.ANALYTICS'})}
                              delimiter=';'
                              headers={
                                [
                                  intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' }),
                                  intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' }),
                                  intl.formatMessage({ id: 'CLAIM.STATS.TOTAL_CLAIMS' }),
                                  intl.formatMessage({ id: 'CLAIM.STATS.IN_TREATMENT_CLAIMS' }),
                                  intl.formatMessage({ id: 'CLAIM.STATS.TREATED_CLAIMS' }),
                                  intl.formatMessage({ id: 'CLAIM.STATS.NON_FOUNDED_CLAIMS' })
                                ]
                              }
                              data={reportingAnalyticsDatas?.map((e:any, i:number) => {
                              return {
                                'Objet': e.libelle,
                                'Categorie': e.category.libelle,
                                'Nombre de réclamations total': e.nb_claims,
                                'Nombre de réclamation en cour de traitement': e.nb_claims_in_process,
                                'Nombre de réclamation traitées': e.nb_claims_processed,
                                'Nombre de réclamation non-traitées': e.nb_claims_unfounded
                              }
                            } )}>
                              <KTIcon iconName="filter" className="fs-2" />
                              {intl.formatMessage({ id: 'GEN.EXPORT' })}
                            </CsvDownloadButton>

                          </div>
                        </div>

                      </div>

                      <div
                        className="card-body pt-2 pb-4 d-flex flex-wrap align-items-center"
                        style={{ height: 'auto' }}
                      >

                        <div className="me-5 pt-2 w-100">

                        {/* begin::Table container */}
                        <div className="table-responsive">
                          <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                            <thead>
                              <tr className="border-0">
                                <th className="p-0 min-w-50px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.CLAIMS_CATEORY' })}
                                </th>
                                <th className="p-0 min-w-150px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.CLAIMS_OBJECTS' })}
                                </th>
                                <th className="p-0 min-w-50px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.TOTAL_CLAIMS' })}
                                </th>
                                <th className="p-0 min-w-50px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.IN_TREATMENT_CLAIMS' })}
                                </th>
                                <th className="p-0 min-w-50px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.TREATED_CLAIMS' })}
                                </th>
                                <th className="p-0 min-w-50px fw-bolder text-left">
                                {intl.formatMessage({ id: 'CLAIM.STATS.NON_FOUNDED_CLAIMS' })}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {reportingAnalyticsDatas?.map((row:any, index:number) => (
                                <tr key={index}>

                                <td className=" text-left">
                                  <div className="symbol symbol-45px me-2 text-hover-primary">
                                    <h5>{row.category.libelle}</h5>
                                  </div>
                                </td>

                                  <td className=" text-left">
                                    <div className="symbol symbol-45px me-2 text-hover-primary">
                                      <h5>{row.libelle}</h5>
                                    </div>
                                  </td>

                                  <td className=" text-right">
                                    <div className="symbol symbol-45px me-2 text-hover-primary">
                                      <h5>{row.nb_claims}</h5>
                                    </div>
                                  </td>

                                  <td className=" text-right">
                                    <div className="symbol symbol-45px me-2 text-hover-primary">
                                      <h5>{row.nb_claims_in_process}</h5>
                                    </div>
                                  </td>

                                  <td className=" text-right">
                                    <div className="symbol symbol-45px me-2 text-hover-primary">
                                      <h5>{row.nb_claims_processed}</h5>
                                    </div>
                                  </td>

                                  <td className=" text-right">
                                    <div className="symbol symbol-45px me-2 text-hover-primary">
                                      <h5>{row.nb_claims_unfounded}</h5>
                                    </div>
                                  </td>

                                </tr>
                              ))}
                            </tbody>
                            {/* end::Table body */}
                          </table>

                          <div className="row">
                            {gettingReportingAnalyticsLoader && reportingAnalyticsDatas?.length == 0 ? (
                              <h3 className="fw-bolder text-center col-12 mv-2rem">
                                {intl.formatMessage({ id: 'GEN.LOADING' })}
                              </h3>
                            ) : (
                              ''
                            )}

                            {!gettingReportingAnalyticsLoader && reportingAnalyticsDatas?.length == 0 ? (
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

            {/* end::Table container */}

        </div>
        {/* begin::Body */}

      </div>
    </>
  );
};

export { ReportingAnalytics };
