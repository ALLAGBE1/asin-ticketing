import { FC } from 'react';
// import {toAbsoluteUrl} from '../../../helpers'y

type Props = {
  icon: string;
  title: string;
  progress: number;
};

const CardSatisFileExt: FC<Props> = ({ icon, title, progress }) => {
  return (
    <div className="card h-100">
      <div className="card-body d-flex justify-content-center text-center flex-column p-8">
        <a className="text-gray-800 text-hover-primary d-flex flex-column">
          <div className="symbol symbol-75px mb-6">
            <img src={icon} alt="" />
          </div>
          <div className="fs-5 fw-bolder mb-1">{title}</div>
          <div className="h-8px mx-3 w-100 bg-bg-white-primary rounded">
            <div
              className="bg-success rounded h-8px"
              role="progressbar"
              style={{ width: `${progress ? progress : 0}%` }}
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </a>
      </div>
    </div>
  );
};

export { CardSatisFileExt };
