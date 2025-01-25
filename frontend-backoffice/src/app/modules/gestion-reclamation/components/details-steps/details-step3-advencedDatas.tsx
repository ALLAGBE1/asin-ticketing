/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { capitalizeStr } from '../../../../utils/functions';

const DetailsStep3AdvencedDatas: FC<any> = (props) => {
  const intl = useIntl();

  return (
    <div className="timeline-item">
      <div className="timeline-line w-40px"></div>

      <div className="timeline-icon symbol symbol-circle symbol-40px">
        <div className="symbol-label bg-light">
          <KTIcon iconName="note" className="fs-2 text-gray-500" />
        </div>
      </div>

      <div className="timeline-content mb-10 mt-n1">
        <div className="overflow-auto pe-3">
          <div className="fs-5 fw-bold mt-4 text-success">
            {intl.formatMessage({ id: 'CLAIM.ADVANCED_DATAS' })}
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
                {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.object?.libelle}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.RECEIVING_CHANNEL' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.reception_channel?.libelle}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.RESPONSE_CHANNEL' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.response_channel?.libelle}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
              </label>

              <h5 className="text-hover-primary">
                {props._claim.institution?.name},{' '}
                {props._claim.institution?.IsoCode}:
                {props._claim.institution?.acronym}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'GEN.IS_REPEAT' })}
              </label>

              <h5
                className={
                  props._claim.is_reminder
                    ? 'is-REMINDING width-min'
                    : 'no-REMINDING width-min'
                }
              >
                {props._claim.is_reminder
                  ? capitalizeStr(intl.formatMessage({ id: 'GEN.YES' }))
                  : capitalizeStr(intl.formatMessage({ id: 'GEN.NO' }))}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailsStep3AdvencedDatas };
