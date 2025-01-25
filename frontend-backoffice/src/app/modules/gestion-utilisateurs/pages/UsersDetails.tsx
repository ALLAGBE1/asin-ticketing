/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { KTIcon } from '../../../../_metronic/helpers';
import { Dropdown1 } from '../../../../_metronic/partials';
import { useIntl } from 'react-intl';
import { PageLink, PageTitle } from '../../../../_metronic/layout/core';
import { UserAccountRequest } from '../core/services/userAccountRequest';
import { AdminUserAccountRequest } from '../core/services/adminUserAccountRequest';
import { ProfileRequest } from '../../gestion-profile/core/services/ProfileRequests';
import { handleHttpError } from '../../../utils/functions';

const userAccountRequest = new UserAccountRequest();
const adminUsersAccountRequest = new AdminUserAccountRequest();
const profileRequests = new ProfileRequest();

const UserDetails: FC = () => {

  const intl = useIntl();

  const location = useLocation();

  const userId: any = useParams()['user_id'];

  const [userDataLoader, setuserDataLoader] = useState<any>(false);
  const [userClaimsDatasLoader, setuserClaimsDatasLoader] = useState<any>(false);
  const [userLogsDatasLoader, setuserLogsDatasLoader] = useState<any>(false);

  const [userDatas, setuserDatas] = useState<any>();

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: intl.formatMessage({ id: 'MANAGEMENT.USERS' }),
      path: '/users/list',
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

  const getUserDataInfosByUserId = async () => {

    await userAccountRequest
      .getCurrentUserDatasById(userId)
      .then((response: any) => {
        console.log(response.data);
        setuserDatas(response.data)
        setuserDataLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });

  };

  useEffect(() => {
    getUserDataInfosByUserId()
    // console.log(userId)
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>
        {intl.formatMessage({ id: 'USER_ACCOUNT.DETAILS' })}
      </PageTitle>

      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                {/* <img src={toAbsoluteUrl('media/avatars/300-1.jpg')} alt='Metornic' /> */}
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${userDatas?.profile?.first_name}+${userDatas?.profile?.last_name}`}
                  alt="Metornic"
                />
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
                      {userDatas?.profile?.first_name}{' '}
                      {userDatas?.profile?.last_name} {' | '}

                      {userDatas?.roles?.map((row:any, index:number) => (
                        <>
                        <span key={index}>{row.name}</span>
                        { userDatas?.roles.length > 1 && index + 1 != userDatas?.roles.length && <span>, </span> }
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
                      {userDatas?.fonction} / {userDatas?.unity?.libelle}
                    </a>
                    <a
                      className="d-flex fs-3 align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon iconName="geolocation" className="fs-4 me-1" />
                      {userDatas?.profile?.department}, {userDatas?.profile?.city}
                      , {userDatas?.profile?.address}
                    </a>
                    <a
                      className="d-flex fs-3 align-items-center text-gray-500 text-hover-primary mb-2"
                    >
                      <KTIcon iconName="sms" className="fs-4 me-1" />
                      {userDatas?.profile?.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="d-flex overflow-auto h-55px">
            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
              <li className="nav-item">
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname ===
                      `/users/details/${userId}/claims` &&
                      'active')
                  }
                  to={`/users/details/${userId}/claims`}
                >
                  {intl.formatMessage({ id: 'CLAIM.TREATED' })}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname ===
                      `/users/details/${userId}/logs` &&
                      'active')
                  }
                  to={`/users/details/${userId}/logs`}
                >
                  {intl.formatMessage({ id: 'USER.ACTIVITIES' })}
                </Link>
              </li>

              {/* <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/crafted/pages/profile/campaigns' && 'active')
                  }
                  to='/crafted/pages/profile/campaigns'
                >
                  Campaigns
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/crafted/pages/profile/documents' && 'active')
                  }
                  to='/crafted/pages/profile/documents'
                >
                  Documents
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/crafted/pages/profile/connections' && 'active')
                  }
                  to='/crafted/pages/profile/connections'
                >
                  Connections
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export { UserDetails };
