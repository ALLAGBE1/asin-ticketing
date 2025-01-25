/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { PageTitle } from '../../../_metronic/layout/core';

import { DashCardsWidget1 } from './components/dashCardsWidget_1';
import { TablePagination } from '@mui/material';
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
import { DashboardAsHolding } from './DashboardAsHolding';
import { DashboardAsInstitution } from './DashboardAsInstitution';

import './DashboardStyles.css';

const claimRequest = new ClaimRequest();
const responseChannelRequest = new ResponseChannelRequest();
const unityRequest = new UnityRequest();
const statsRequest = new StatsRequests();

const DashboardWrapper: FC = () => {
  const intl = useIntl();

  const navigate = useNavigate();

  const [claimloader, setclaimloader] = useState(true);
  const [claimStatsLoader, setclaimStatsLoader] = useState(true);

  const [ref, setref] = useState('');

  const [responseChannelId, setResponseChannelId] = useState<number | any>();

  const [page, setpage] = useState(0);
  const [rowsPerPageSize, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 30, 60, 100]);
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

  const [date_periode_values] = useState([30, 45, 90]);
  const [datePeriode, setdatePeriode] = useState(30);
  const [claimsStats, setclaimsStats] = useState<any>();

  const newClaim = () => {
    navigate('/claims/new');
  };

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));


  useEffect(() => {

    MenuComponent.reinitialization();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      </PageTitle>

      {IsAHolding() ? <DashboardAsHolding /> : <DashboardAsInstitution />}
    </>
  );
};

export { DashboardWrapper };
