/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './GestionProfile.css';
import { KTIcon } from '../../../_metronic/helpers';
import { getAvatarSrcLink } from '../../utils/functions';
import { useIntl } from 'react-intl';

const GestionProfileLayout: FC = () => {
  const intl = useIntl();

  const location = useLocation();
  //@ts-ignore
  const USER_DATAS = JSON.parse(
    //@ts-ignore
    localStorage.getItem(
      import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS,
    ),
  );

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img src={getAvatarSrcLink()} alt="Metronic" />
                <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-1 fw-bolder me-1"
                    >
                      {USER_DATAS.profile.first_name}{' '}
                      {USER_DATAS.profile.last_name} {' | '}

                      {USER_DATAS.roles?.map((row:any, index:number) => (
                        <>
                        <span key={index}>{row.name}</span>
                        { USER_DATAS.roles.length > 1 && index + 1 != USER_DATAS.roles.length && <span>, </span> }
                      </>
                      ))}
                    </a>
                    {/* <a href="#">
                      <KTIcon iconName="verify" className="fs-1 text-primary" />
                    </a> */}
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a
                      className="d-flex fs-3 align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon iconName="profile-circle" className="fs-4 me-1" />
                      {USER_DATAS.fonction} / {USER_DATAS.unity.libelle}
                    </a>
                    <a
                      className="d-flex fs-3 align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon iconName="geolocation" className="fs-4 me-1" />
                      {USER_DATAS.profile.department}, {USER_DATAS.profile.city}
                      , {USER_DATAS.profile.address}
                    </a>
                    <a
                      className="d-flex fs-3 align-items-center text-gray-500 text-hover-primary mb-2"
                    >
                      <KTIcon iconName="sms" className="fs-4 me-1" />
                      {USER_DATAS.profile.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex overflow-auto h-55px">
            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
              <li className="nav-item fs-3">
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/profile/overview' && 'active')
                  }
                  to="/profile/overview"
                >
                  {intl.formatMessage({ id: 'GEN.OVERVIEW' })}
                </Link>
              </li>
              <li className="nav-item fs-3">
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/profile/update-password' &&
                      'active')
                  }
                  to="/profile/update-password"
                >
                  {intl.formatMessage({ id: 'GEN.PASSWORD' })}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export { GestionProfileLayout };
