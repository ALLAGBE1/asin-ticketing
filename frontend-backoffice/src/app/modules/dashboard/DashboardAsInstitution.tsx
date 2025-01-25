/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { PageTitle } from '../../../_metronic/layout/core';

import { DashCardsWidget1 } from './components/dashCardsWidget_1';
import { LinearProgress, TablePagination } from '@mui/material';
import { ClaimRequest } from '../gestion-reclamation/core/services/ClaimRequest';
import { ResponseChannelRequest } from '../gestion-paramettres/core/services/ResponseChannelRequests';
import { useNavigate } from 'react-router-dom';
import { ClaimModel } from '../gestion-reclamation/core/models/Claim';
import { ResponseChannelModel } from '../gestion-paramettres/core/models/ResponseChannel';
import { MenuComponent } from '../../../_metronic/assets/ts/components';
import { handleHttpError } from '../../utils/functions';
import { LongClaimsTable } from '../gestion-reclamation/components/claimTables/longClaimsTable';
import { IsAHolding } from '../../utils/permissionAccessHandler';
import { UnityRequest } from '../gestion-paramettres/core/services/UnityRequests';
import { UnityModel } from '../gestion-paramettres/core/models/Unity';
import { StatsRequests } from './service/StatsRequests';
import { DashCardsWidgetDonutChart } from './components/dashCardsWidget_DonutChart';
import { ROUNDED_LOADER } from '../../utils/contents-loader/ROUNDED_LOADER';

import './DashboardStyles.css';
import { ClaimsMetricCard } from './components/claimsMetricCard';
import { DashCardsWidgetBarChart } from './components/dashCardsWidget_BarChart';
import { DashCardsWidgetLineChart } from './components/dashCardsWidget_LineChart';
import { LongClaimsTableFilter } from '../gestion-reclamation/pages/claimsTableFilter/longClaimsTableFilter';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();
const unityRequest = new UnityRequest();
const statsRequest = new StatsRequests();

const DashboardAsInstitution: FC = () => {
  const intl = useIntl();

  const navigate = useNavigate();

  const [claimloader, setclaimloader] = useState(true);
  const [claimStatsLoader, setclaimStatsLoader] = useState(true);
  const [
    claimsStatsMetricsByReceptionCanalLoader,
    setclaimsStatsMetricsByReceptionCanalLoader,
  ] = useState(true);
  const [
    claimsStatsOfStatusByMonthLoader,
    setclaimsStatsOfStatusByMonthLoader,
  ] = useState(true);
  const [
    claimsStatsRateByInstitutionLoader,
    setclaimsStatsRateByInstitutionLoader,
  ] = useState(true);

  const [ref, setref] = useState('');

  const [responseChannelId, setResponseChannelId] = useState<number | any>();

  const [page, setpage] = useState(0);
  const [rowsPerPageSize, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
  const [metricSlots] = useState(new Array(8));
  const [totalItems, settotalItems] = useState(0);

  const [claimDatas, setclaimDatas] = useState(Array<ClaimModel | any>);
  const [allUnities, setAllUnities] = useState(Array<UnityModel | any>);
  const [allUnitiesByInstitutionId, setAllUnitiesByInstitutionId] = useState(
    Array<UnityModel | any>,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );

  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  const date_periode_values = [30, 45, 90];
  const [datePeriode, setdatePeriode] = useState(30);

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
  const [selectedMonthByForSatisfactionByStatus, setselectedMonthByForSatisfactionByStatus] = useState(new Date().getMonth()+1);

  const [selectedYearForMetricsByStatusMonthly, setselectedYearForMetricsByStatusMonthly] = useState(new Date().getFullYear());

  const [selectedMonthForObjectStats, setselectedMonthForObjectStats] = useState(new Date().getMonth()+1);

  const [selectedYearForObjectsStats, setselectedYearForObjectsStats] = useState(new Date().getFullYear());

  const [gettingObjectsStatsLoader, setgettingObjectsStatsLoader] = useState(true);

  const [claimsStatsOfObjects, setclaimsStatsOfObjects] =
    useState<any>();

  const [claimsStats, setclaimsStats] = useState<any>();
  const [claimsStatsMetrics, setclaimsStatsMetrics] = useState<any>();
  const [
    claimsStatsMetricsByReceptionCanal,
    setclaimsStatsMetricsByReceptionCanal,
  ] = useState<any>();
  const [claimsStatsOfStatusByMonth, setclaimsStatsOfStatusByMonth] =
    useState<any>();

  const [
    claimsStatsRateByInstitutionLabels,
    setclaimsStatsRateByInstitutionLabels,
  ] = useState<any>();
  const [claimsStatsRateByInstitution, setclaimsStatsRateByInstitution] =
    useState<any>();

  const newClaim = () => {
    navigate('/claims/new');
  };

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const handlePeriodChange = (event:any) => {
    const value = parseInt(event.target.value);
    setdatePeriode(value);
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

  const getUnitiesByInstitutionId = async () => {
    await unityRequest
      .getUnityListByInstitutionId(user_datas.unity.institution.id)
      .then((response: any) => {
        console.log(response);
        setAllUnitiesByInstitutionId(response.data);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimsStatsFronInstitutionOnly = async () => {
    setclaimStatsLoader(true);
    await statsRequest
      .getClaimsStatsForInstitution(
        datePeriode,
        user_datas.unity.institution.id,
      )
      .then((response: any) => {
        console.log(response.data);
        setclaimsStats(response.data);
        setclaimStatsLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimsStatsOfStatusByMonth = async (year:number) => {
    setselectedYearForMetricsByStatusMonthly(year)
    setclaimsStatsOfStatusByMonthLoader(true);
    await statsRequest
      .getClaimsStatsOfStatusByMonth(year)
      .then((response: any) => {
        const _datas = response.data;

        const _statusLabels = Object.keys(_datas[0].status);

        setclaimsStatsOfStatusByMonth(
          _statusLabels.map((_label) => {
            return {
              name: _label,
              data: _datas.map((item: any) => item.status[_label]),
            };
          }),
        );

        setclaimsStatsOfStatusByMonthLoader(false);
      })
      .catch((error: any) => {
        console.log(error);
        handleHttpError(error);
      });
  };

  const changeMonthObjectsTimePeriodeStatsval = async (month: number) => {
    setselectedMonthForObjectStats(month)
    getClaimsStatsByRObjectsTimePeriode(month, selectedYearForObjectsStats)
  };

  const changeYearObjectsTimePeriodeStatsval = async (year: number) => {
    setselectedYearForObjectsStats(year)
    getClaimsStatsByRObjectsTimePeriode(selectedMonthForObjectStats, year)
  };

  const getClaimsStatsByRObjectsTimePeriode = async (month: number, year:number) => {
    setgettingObjectsStatsLoader(true);
    await statsRequest
      .getClaimsStatsByRObjectsTimePeriode(month, year)
      .then((response: any) => {
        const _datas = response.data;
        console.log(_datas)
        setclaimsStatsOfObjects(_datas);
        setgettingObjectsStatsLoader(false);
      })
      .catch((error: any) => {
        console.log(error);
        handleHttpError(error);
      });
  };

  const getClaimsStatsByReceptionCanal = async (month:number) => {
    setclaimsStatsMetricsByReceptionCanalLoader(true);
    await statsRequest
      .getClaimsStatsByReceptionChannelByTimePeriode(month)
      .then((response: any) => {
        console.log(response.data);
        setclaimsStatsMetricsByReceptionCanal(response.data);
        setclaimsStatsMetricsByReceptionCanalLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const buildMetricDatas = () => {
    setclaimsStatsMetrics([{}]);
  };

  const getClaimsStatsRateByInstitution = async () => {
    // await statsRequest.getClaimsStatsRateByInstitution()
    // .then(
    //   (response:any) => {
    //     // console.log(response.data)
    //     const _datas = response.data;
    //     const _institutionsLabels = Object.keys(_datas.nb_claims_by_institution);
    //     setclaimsStatsRateByInstitutionLabels(_institutionsLabels)
    //     setclaimsStatsRateByInstitution(
    //       _institutionsLabels.map(
    //         // @ts-ignore
    //         (_label:any) => { return  parseInt( ( _datas.nb_claims_by_institution[_label] * 100 ) / _datas.nb_total_claims )  }
    //       )
    //     );
    //     setclaimsStatsRateByInstitutionLoader(false)
    //   }
    // )
    // .catch(
    //   (error:any) => {
    //     handleHttpError(error)
    //   }
    // );
  };

  useEffect(() => {
    if (user_datas) {
      getUnitiesByInstitutionId();
      getClaimsStatsFronInstitutionOnly();
      getClaimsStatsByReceptionCanal(selectedMonthByForSatisfactionByStatus);
      getClaimsStatsOfStatusByMonth(selectedYearForMetricsByStatusMonthly);
      getClaimsStatsRateByInstitution();

      getClaimsStatsByRObjectsTimePeriode(selectedMonthForObjectStats, selectedYearForObjectsStats);
    }

    getResponseChannelList();

    MenuComponent.reinitialization();
  }, []);

  return (
    <>

      <div className="row mt-5 mb-15">

        <div className="d-flex justify-content-start" data-kt-user-table-toolbar="base"
                  >
                    {/* begin::Filter Button */}
                    <button
                      type="button"
                      className="btn btn-light-primary me-3"
                      data-kt-menu-trigger="click"
                      data-kt-menu-placement="bottom-start"
                    >
                      <KTIcon iconName="filter" className="fs-2" />
                      {intl.formatMessage({ id: 'CLAIM.STATS.ACTIONS.BY_PERIOD' })}
                    </button>
                    {/* end::Filter Button */}
                    {/* begin::SubMenu */}
                    <div
                      className="menu menu-sub menu-sub-dropdown w-300px w-md-200px"
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

                        {
                          date_periode_values?.map((row, index) => (
                              <div className="mb-10" key={index}>
                                <div className="form-check form-check-custom form-check-solid">
                                    <input className="form-check-input" type="radio"
                                           onChange={(e:any) => handlePeriodChange(e)}
                                           checked={datePeriode === row}
                                           value={row} id={"flexRadioChecked-" + row} />
                                    <label className="form-check-label" htmlFor={"flexRadioChecked-" + row}>
                                      {row}  Dernier Jours
                                    </label>
                                </div>
                              </div>
                          ))
                        }

                        {/* end::Input group */}

                        {/* begin::Actions */}
                        <div className="d-flex justify-content-end">
                          {/* <button
                            onClick={() => resetFilter()}
                            type="button"
                            className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                            data-kt-menu-dismiss="true"
                            data-kt-user-table-filter="reset"
                          >
                            {intl.formatMessage({ id: 'GEN.RESET' })}
                          </button> */}

                          <button
                            onClick={() => getClaimsStatsFronInstitutionOnly()}
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

      {/* begin::Row */}
      <div className="row g-5 g-xl-10">

            <div className="col-12">
            { claimStatsLoader && <LinearProgress /> }
            </div>

            {/* begin::Col */}

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#4CAF5026',
                  boxShadow: '0px 4px 3px -1px ' + '#4CAF50',
                }}
              >
                <h4 style={{textAlign: "center"}}>
                  {intl.formatMessage({ id: 'CLAIM.STATS.COMPLETED_CLAIMS' })}
                </h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    {claimsStats ? claimsStats.nb_completed_claims : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#E64A1926',
                  boxShadow: '0px 4px 3px -1px ' + '#E64A19',
                }}
              >
                <h4 style={{textAlign: "center"}}>
                  {intl.formatMessage({ id: 'CLAIM.STATS.INCOMPLETED_CLAIMS' })}
                </h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#E64A19' }}
                  >
                    {claimsStats ? claimsStats.nb_uncompleted_claims : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#FFC85726',
                  boxShadow: '0px 4px 3px -1px ' + '#FFC857',
                }}
              >
                <h4 style={{textAlign: "center"}}>
                  {intl.formatMessage({ id: 'CLAIM.STATS.IN_TREATMENT_CLAIMS' })}
                </h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#FFC857' }}
                  >
                    {claimsStats ? claimsStats.nb_in_process_claims : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#3A508126',
                  boxShadow: '0px 4px 3px -1px ' + '#3A5081',
                }}
              >
                <h4 style={{textAlign: "center"}}>
                  {intl.formatMessage({ id: 'CLAIM.STATS.TREATED_CLAIMS' })}
                </h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#3A5081' }}
                  >
                    {claimsStats ? claimsStats.nb_processed_claims : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#9A031E26',
                  boxShadow: '0px 4px 3px -1px ' + '#9A031E',
                }}
              >
                <h4 style={{textAlign: "center"}}>
                  {intl.formatMessage({ id: 'CLAIM.STATS.NON_FOUNDED_CLAIMS' })}
                </h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#9A031E' }}
                  >
                    {claimsStats ? claimsStats.nb_unfounded_claims : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#58A4B026',
                  boxShadow: '0px 4px 3px -1px ' + '#58A4B0',
                }}
              >
                <h4 style={{textAlign: "center"}}>{intl.formatMessage({ id: 'CLAIM.STATS.TREATED_IN_TIMES_CLAIMS' })}</h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#58A4B0' }}
                  >
                    {claimsStats ? claimsStats.nb_claims_processed_in_delay : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#E6790026',
                  boxShadow: '0px 4px 3px -1px ' + '#E67900',
                }}
              >
                <h4 style={{textAlign: "center"}}>{intl.formatMessage({ id: 'CLAIM.STATS.SATISFACTION_NUMBERS' })}</h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#E67900' }}
                  >
                    {claimsStats ? claimsStats.nb_satisfied_surveys : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div
                className="w-100 metric"
                style={{
                  backgroundColor: '#9C27B026',
                  boxShadow: '0px 4px 3px -1px ' + '#9C27B0',
                }}
              >
                <h4 style={{textAlign: "center"}}>{intl.formatMessage({ id: 'CLAIM.STATS.SATISFACTION_RATE' })}</h4>
                <div className="d-flex">
                  <div
                    className="col-6 metric_value"
                    style={{ backgroundColor: '#9C27B0' }}
                  >
                    {claimsStats ? claimsStats.nb_satisfied_surveys + ' %' : '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* end::Row */}
      </div>
      {/* end::Row */}


      {/* begin::Row */}
      <div className="row g-5 g-xl-10 mt-8">
        {/* begin::Col */}

        <div className="col-12 col-md-12">
          {claimsStatsOfStatusByMonthLoader && claimsStatsOfStatusByMonth?.length == 0 ? (
            <ROUNDED_LOADER width="100%" height="100px" />
          ) : (
            <div className={`card card-flush`}>

              { claimsStatsOfStatusByMonthLoader && <LinearProgress /> }

              <div className="card-header border-0 pt-6">

              <div className="card-title">
                {/* begin::Search */}
                <div className="d-flex align-items-center position-relative my-1">
                    {intl.formatMessage({
                      id: 'CLAIM.STATS.RATE_EVOLUTION_BY_MONTH',
                    })}
                </div>
                {/* end::Search */}
              </div>

              {/* begin::Card toolbar */}
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >

                <input
                    type="number"
                    onChange={(e:any) => getClaimsStatsOfStatusByMonth(e.target.value)}
                    value={selectedYearForMetricsByStatusMonthly}
                    max={selectedYearForMetricsByStatusMonthly}
                    className="w-50 form-control bg-transparent"
                />

                </div>
              </div>

              {/* end::Card toolbar */}
              </div>

              <div className="card-body pt-2 pb-4 d-flex">
                <div className="row w-100">
                  <DashCardsWidgetLineChart
                    hasLegend={true}
                    optionsLabels={[
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Nov',
                      'Oct',
                      'Dec',
                    ]}
                    height='300px'
                    optionsDatas={claimsStatsOfStatusByMonth}
                  />
                  {/* <ReactApexChart options={state.options} series={state.series} type="area" className="mx-auto" /> */}
                  <div id="chart"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* end::Row */}

        {/* begin::Col */}

        <div className="col-12 col-md-12">
          {claimsStatsMetricsByReceptionCanalLoader && !claimsStatsMetricsByReceptionCanal ? (
            <ROUNDED_LOADER width="100%" height="100%" />
          ) : (
            <div className={`card card-flush`}>
              { claimsStatsMetricsByReceptionCanalLoader && <LinearProgress /> }
              <div className="card-header border-0 pt-6">

              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                    {intl.formatMessage({
                      id: 'CLAIM.STATS.CLAIM_BY_RECEPTION_CHANEL',
                    })}
                </div>
              </div>

              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >

                <select
                          className="form-select form-select-solid fw-bolder"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-allow-clear="true"
                          data-kt-user-table-filter="role"
                          data-hide-search="true"
                          onChange={(e) => getClaimsStatsByReceptionCanal(parseInt(e.target.value))}
                          value={selectedMonthByForSatisfactionByStatus}
                        >

                          {months?.map((row, index) => (
                            <option key={index} value={row.value}>
                              {intl.formatMessage({ id: row.name })}
                            </option>
                          ))}

                  </select>

                </div>
              </div>

              {/* end::Card toolbar */}
              </div>

              <div className="card-body pt-2 pb-4 d-flex">
                <div className="row w-100">
                  <DashCardsWidgetBarChart
                    height='350px'
                    optionsLabels={Object.keys(claimsStatsMetricsByReceptionCanal)}
                    optionsDatas={Object.values(claimsStatsMetricsByReceptionCanal)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* end::Row */}

        {/* begin::Col */}

        <div className="col-12 col-md-12">
          {gettingObjectsStatsLoader && !claimsStatsOfObjects ? (
            <ROUNDED_LOADER width="100%" height="100%" />
          ) : (
            <div className={`card card-flush`}>
              { gettingObjectsStatsLoader && <LinearProgress /> }
              <div className="card-header border-0 pt-6">

              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                    {intl.formatMessage({
                      id: 'CLAIM.STATS.CLAIM_BY_OBJECTS_BY_PERIOD',
                    })}
                </div>
              </div>

              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >

                <input
                    type="number"
                    onChange={(e:any) => changeYearObjectsTimePeriodeStatsval(e.target.value)}
                    value={selectedYearForObjectsStats}
                    max={selectedYearForObjectsStats}
                    className="w-50 form-control bg-transparent mx-2"
                />

                <select
                          className="form-select form-select-solid fw-bolder mx-2"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-allow-clear="true"
                          data-kt-user-table-filter="role"
                          data-hide-search="true"
                          onChange={(e) => changeMonthObjectsTimePeriodeStatsval(parseInt(e.target.value))}
                          value={selectedMonthForObjectStats}
                        >

                          {months?.map((row, index) => (
                            <option key={index} value={row.value}>
                              {intl.formatMessage({ id: row.name })}
                            </option>
                          ))}

                </select>

                </div>
              </div>

              {/* end::Card toolbar */}
              </div>

              <div className="card-body pt-2 pb-4 d-flex">
                <div className="row w-100">
                  <DashCardsWidgetBarChart
                    height='450px'
                    optionsLabels={Object.keys(claimsStatsOfObjects)}
                    optionsDatas={Object.values(claimsStatsOfObjects)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* end::Row */}
      </div>
      {/* end::Row */}

      <LongClaimsTableFilter
            // status_id={2}
            institution_id={user_datas.unity.institution.id}
            canMakeFilter={true}
            canExportClaim={false}
            canImportClaim={false}
            canAddClaim={true}
          />

    </>
  );
};

export { DashboardAsInstitution };
