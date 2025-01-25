/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, Key, useEffect } from 'react';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { CardSatisFileDisplay } from '../../../../../_metronic/partials/content/cards/Card-Satis-FileDisplay';

const DetailsStep5ProofsDatas: FC<any> = (props) => {
  const intl = useIntl();

  useEffect(() => {
    console.log(props._claim);
  }, []);

  return (
    <div className="timeline-item">
      <div className="timeline-line w-40px"></div>

      <div className="timeline-icon symbol symbol-circle symbol-40px">
        <div className="symbol-label bg-light">
          <KTIcon iconName="disconnect" className="fs-2 text-gray-500" />
        </div>
      </div>

      <div className="timeline-content mb-10 mt-n1">
        <div className="overflow-auto pe-3">
          <div className="fs-5 fw-bold mt-4 text-info">
            {intl.formatMessage({ id: 'CLAIM.PROOFS_DATAS' })}
          </div>
        </div>

        <div className="overflow-auto pb-5">
          {props._claim.proofs.length == 0 ? (
            <>
              <div className="row mt-7">
                <div className="col-lg-12 mb-6">
                  <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                    🚫 {intl.formatMessage({ id: 'CLAIM.NO_PROOFS' })}
                  </h3>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row align-items-center border border-dashed border-gray-300 rounded min-w-700px p-5">
                {props._claim.proofs?.map(
                  (row: { id: Key | null | undefined }) => (
                    <div key={row.id} className="col-6 col-md-4 col-lg-3">
                      <CardSatisFileDisplay fileData={row} />
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { DetailsStep5ProofsDatas };
