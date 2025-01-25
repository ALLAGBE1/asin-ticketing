/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { getGenderAvatar } from '../../../../../utils/functions';

const CustomerDatas: FC<any> = (props) => {
  const intl = useIntl();

  return (
    <>
      <div className="row">
        <div className="col-md-3 mb-8">
          <label>{intl.formatMessage({ id: 'USER.FIRSTNAME' })}</label>
          <h2>{props.customerDatas.profile.first_name}</h2>
        </div>

        <div className="col-md-3 mb-8">
          <label>{intl.formatMessage({ id: 'USER.LASTNAME' })}</label>
          <h2>{props.customerDatas.profile.last_name}</h2>
        </div>

        <div className="col-md-3 mb-8">
          {/* <label>{intl.formatMessage({id: 'USER.SEXE'})}</label> */}
          <div className="d-flex align-items-center">
            <div className="symbol symbol-45px me-5">
              <img
                src={getGenderAvatar(props.customerDatas.profile.sex)}
                alt=""
              />
            </div>
          </div>
          {/* <h2>{ props.customerDatas.profile.sex }</h2> */}
        </div>

        <div className="col-md-3 mb-8">
          <label>{intl.formatMessage({ id: 'USER.ACCOUNT_NUMBER' })}</label>
          <h2>{props.customerDatas.account_number}</h2>
        </div>

        <div className="col-md-3 mb-8">
          <label>{intl.formatMessage({ id: 'USER.PHONE' })}</label>
          <h2>
            <a>
              {props.customerDatas.profile.telephone}
            </a>
          </h2>
        </div>

        <div className="col-md-3 mb-8">
          <label>{intl.formatMessage({ id: 'USER.EMAIL' })}</label>
          <h2>
            <a>
              {props.customerDatas.profile.email}
            </a>
          </h2>
        </div>
      </div>
    </>
  );
};

export { CustomerDatas };
