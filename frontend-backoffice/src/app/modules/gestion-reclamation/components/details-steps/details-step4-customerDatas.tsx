/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { getGenderAvatar } from '../../../../utils/functions';

const DetailsStep4CustomerDatas: FC<any> = (props) => {
  const intl = useIntl();

  return (
    <div className="timeline-item">
      <div className="timeline-line w-40px"></div>

      <div className="timeline-icon symbol symbol-circle symbol-40px">
        <div className="symbol-label bg-light">
          <KTIcon iconName="user" className="fs-2 text-gray-500" />
        </div>
      </div>

      <div className="timeline-content mb-10 mt-n1">
        <div className="overflow-auto pe-3">
          <div className="fs-5 fw-bold mt-4 text-danger">
            {intl.formatMessage({ id: 'CLAIM.CUSTOMER_DATAS' })}
          </div>

          {/* <div className='d-flex align-items-center mt-1 fs-6'>
            <div className='text-muted me-2 fs-7'>Sent at 4:23 PM by</div>

            <div
              className='symbol symbol-circle symbol-25px'
              data-bs-toggle='tooltip'
              data-bs-boundary='window'
              data-bs-placement='top'
              title='Alan Nilson'
            >
              <img src={toAbsoluteUrl('media/avatars/300-1.jpg')} alt='img' />
            </div>
          </div> */}
        </div>

        <div className="overflow-auto pb-5">
          <div className="row mt-7">
            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'USER.ACCOUNT_TYPE' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.customer?.customer_type.libelle}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'USER.ACCOUNT_NUMBER' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.customer?.account_number}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'USER.FIRSTNAME' })} &{' '}
                {intl.formatMessage({ id: 'USER.LASTNAME' })}
              </label>

              <div className="d-flex align-items-center">
                <div className="symbol symbol-50px me-5">
                  <span className="symbol-label bg-light">
                    <img
                      src={getGenderAvatar(props._claim.customer?.profile?.sex)}
                      className="h-75 align-self-end"
                      alt=""
                    />
                  </span>
                </div>
                <div className="d-flex justify-content-start flex-column">
                  <h5 className="text-hover-primary">
                    {props._claim.customer?.profile?.first_name}{' '}
                    {props._claim.customer?.profile?.last_name}
                  </h5>
                  <span className="text-muted fw-semibold text-muted d-block fs-7">
                    {props._claim.customer?.profile?.city}
                  </span>
                </div>
              </div>

              {/* <h5 className='text-hover-primary'>{props._claim.customer?.profile?.first_name} {props._claim.customer?.profile?.last_name}</h5> */}
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'USER.EMAIL' })}
              </label>

              <h5 className="text-hover-primary">
                <a
                  href={'mailto:' + props._claim.customer?.profile?.email}
                  className="text-hover-primary"
                >
                  {props._claim.customer?.profile?.email}
                </a>
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'USER.PHONE' })}
              </label>

              <h5 className="text-hover-primary">
                <a
                  href={'tel:' + props._claim.customer?.profile?.telephone}
                  className="text-hover-primary"
                >
                  {props._claim.customer?.profile?.telephone}
                </a>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailsStep4CustomerDatas };
