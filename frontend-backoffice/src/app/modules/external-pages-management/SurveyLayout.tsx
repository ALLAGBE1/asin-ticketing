import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import {Link} from 'react-router-dom'
import { toAbsoluteUrl } from '../../../_metronic/helpers';
// import './Auth.css'

const SurveyLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
    }
    return () => {
      if (root) {
        root.style.height = 'auto';
      }
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100"
        style={{
          backgroundImage: `url(${toAbsoluteUrl('media/ABI_ASSETS/auth-bg-3.png')})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'right',
          backgroundColor: '#fff',
        }}>

      <div
        className="d-flex flex-lg-row-fluid  bgi-size-cover bgi-position-center order-1 order-lg-2"
      >
        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
          <div className=" p-10 bg_white auth_form_border m-10 mt-39">
            <Outlet />
          </div>
        </div>
      </div>

    </div>
  );
};

export { SurveyLayout };
