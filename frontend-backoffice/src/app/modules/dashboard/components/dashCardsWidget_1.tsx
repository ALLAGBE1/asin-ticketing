/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { TEXT_LOADER } from '../../../utils/contents-loader/TEXT_LOADER';

type Props = {
  className: string;
  description: string;
  color: string;
  img: string;
  institution_id: number;
  datas: any;
};

function DashCardsWidget1({
  className,
  description,
  color,
  img,
  institution_id,
  datas,
}: Props): any {
  // useEffect(() => {

  //   const intl = useIntl()

  // })

  const intl = useIntl();

  return (
    <>
      <div
        className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
        style={{
          backgroundColor: color,
          backgroundImage: `url('${img}')`,
        }}
      >
        <div className="card-header h-32rem">
          <div className="card-title d-flex flex-column">
            <span className="fs-3hx fw-bold text-white me-2 lh-1 ls-n2">
              {' '}
              {datas && institution_id ? (
                datas?.nb_claims_by_institution[institution_id]
              ) : (
                <TEXT_LOADER />
              )}{' '}
            </span>
            <span className="text-white opacity-75 pt-1 fw-semibold fs-4">
              {description}
            </span>
          </div>
        </div>
        <div className="card-body d-flex align-items-end pt-0">
          <div className="d-flex align-items-center flex-column mt-3 w-100">
            <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto">
              <span>
                {intl.formatMessage({ id: 'CLAIMS_STATUS.COMPLETED' })}
              </span>
              <span>{datas?.nb_completed_claims}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto">
              <span>
                {intl.formatMessage({ id: 'CLAIMS_STATUS.IN_PROCESS' })}
              </span>
              <span>{datas?.nb_in_process_claims}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto">
              <span>
                {intl.formatMessage({ id: 'CLAIMS_STATUS.PROCESSED' })}
              </span>
              <span>{datas?.nb_processed_claims}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto">
              <span>
                {intl.formatMessage({ id: 'CLAIMS_STATUS.UNCOMPLETED' })}
              </span>
              <span>{datas?.nb_uncompleted_claims}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto">
              <span>
                {intl.formatMessage({ id: 'CLAIMS_STATUS.UNFOUNDED' })}
              </span>
              <span>{datas?.nb_unfounded_claims}</span>
            </div>

            {/* <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto'>
              <span>{intl.formatMessage({id: 'COMPLAINTS.PENDING'})}</span>
              <span>datas?.nb_claims_by_institution</span>
            </div> */}

            {/* <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
              <div
                className='bg-white rounded h-8px'
                role='progressbar'
                style={{width: '72%'}}
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export { DashCardsWidget1 };
