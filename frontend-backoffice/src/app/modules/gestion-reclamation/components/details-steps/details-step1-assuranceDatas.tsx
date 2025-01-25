/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useEffect } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { capitalizeStr } from '../../../../utils/functions';

const DetailsStep1AssuranceDatas: FC<any> = (props) => {
  const intl = useIntl();

  useEffect(() => {
    console.log(props._claim);
  }, []);

  return (
    <div className="timeline-item">
      <div className="timeline-line w-40px"></div>

      <div className="timeline-icon symbol symbol-circle symbol-40px me-4">
        <div className="symbol-label bg-light">
          <KTIcon iconName="message-text-2" className="fs-2 text-gray-500" />
        </div>
      </div>

      <div className="timeline-content mb-10 mt-n1">
        <div className="overflow-auto pe-3">
          <div className="fs-5 fw-bold mt-4 text-primary">
            {intl.formatMessage({ id: 'CLAIM.INSURRANCE_DATAS' })}
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
                {capitalizeStr(props._claim.object?.libelle)}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(props._claim.object?.category.libelle)}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.INSURRANCE_TYPE' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(
                  props._claim.object?.category.insurance_type.libelle,
                )}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.PRODUCT_NAME' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(
                  props._claim.product_name ?? '--'
                )}
              </h5>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
              </label>

              <h5 className="text-hover-primary">
                {capitalizeStr(props._claim.object?.duration_treatment.duration)}{' '}
                {intl.formatMessage({ id: 'GEN.DAYS' })}
              </h5>
            </div>

            <div className="col-lg-2 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
              </label>

              <h5
                className="text-center status"
                style={{
                  backgroundColor:
                    props._claim.object?.severity_level.code_color,
                }}
              >
                {capitalizeStr(props._claim.object?.severity_level.libelle)}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailsStep1AssuranceDatas };
