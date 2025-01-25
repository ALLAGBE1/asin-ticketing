/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { capitalizeStr, dateWithMinutes } from '../../../../utils/functions';

const DetailsStep2BasicDatas: FC<any> = (props) => {
  const intl = useIntl();

  return (
    <div className="timeline-item">
      <div className="timeline-line w-40px"></div>

      <div className="timeline-icon symbol symbol-circle symbol-40px">
        <div className="symbol-label bg-light">
          <KTIcon iconName="notepad" className="fs-2 text-gray-500" />
        </div>
      </div>

      <div className="timeline-content mb-10 mt-n1">
        <div className="overflow-auto pe-3">
          <div className="fs-5 fw-bold mt-4 text-warning">
            {intl.formatMessage({ id: 'CLAIM.BASIC_DATAS' })}
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
                {intl.formatMessage({ id: 'CLAIM.LOCATION_EVENT' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(props._claim.location_event)}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.AGENCY' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(props._claim.agency?.libelle)}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.DATE_EVENT' })}
              </label>

              <h5 className="text-hover-primary">
                { dateWithMinutes(props._claim.date_event)}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
              </label>

              <h5 className="text-hover-primary">
                { props._claim.amount > 0 ? props._claim.amount : '--' }
                {
                  props._claim.currency?.libelle ? capitalizeStr(props._claim.currency?.libelle) : ''
                }
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.DESCRIPTION' })}
              </label>

              <h5 className="text-hover-primary">{props._claim.description}</h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.EXPECT' })}
              </label>

              <h5 className="text-hover-primary">{props._claim.expect}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailsStep2BasicDatas };
