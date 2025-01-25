/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { ErrorMessage, Field } from 'formik';
import { CurrencyRequest } from '../../../gestion-paramettres/core/services/CurrencyRequests';
import { CurrencyModel } from '../../../gestion-paramettres/core/models/Currency';
import { useIntl } from 'react-intl';
import { LOADER_INPUTLOADER } from '../../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { handleHttpError } from '../../../../utils/functions';
import { AgencyRequest } from '../../../gestion-paramettres/core/services/AgencyRequest';
import { AgencyModel } from '../../../gestion-paramettres/core/models/Agency';

const NewClaimStep2BasicDatas: FC<any> = () => {
  const intl = useIntl();
  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const currencyRequest = new CurrencyRequest();
  const agencyRequest = new AgencyRequest();

  const [currencyDatas, setcurrencyDatas] = useState(Array<CurrencyModel>);

  const [loaderCurrencyDatas, setLoaderCurrencyDatas] = useState(true);
  const [agencyloader, setagencyloader] = useState(true);

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);

  const [agencyDatas, setagencyDatas] = useState(
    Array<AgencyModel>,
  );

  const maxDate = currentDate
    .toISOString()
    .substr(0, currentDate.toISOString().length - 1);

  const getCurrencyList = async () => {
    await currencyRequest
      .getCurrencyList()
      .then((response: any) => {
        setcurrencyDatas(response.data.items);
        setLoaderCurrencyDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

    const getAgenciesList = async () => {
      setagencyloader(true);

      await agencyRequest
        .getAgencyList(1, 200, user_datas.unity.institution.id, '')
        .then((response: any) => {
          setagencyDatas(response.data.items);
          setagencyloader(false);
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    };

  useEffect(() => {
    getCurrencyList();
    getAgenciesList()
  }, []);

  return (
    <>
      <div className="w-100">
        <div className="pb-10 pb-lg-15">
          <h2 className="fw-bolder d-flex align-items-center text-gray-900">
            {intl.formatMessage({ id: 'CLAIM.BASIC_DATAS' })}
            {/* <i
              className='fas fa-exclamation-circle ms-2 fs-7'
              data-bs-toggle='tooltip'
              title='Billing is issued based on your selected account type'
            ></i> */}
          </h2>

          <div className="text-gray-500 fw-bold fs-6">
            {intl.formatMessage({ id: 'CLAIM.BASIC_DATAS_DESCRIPTION' })}
            {/* <a href='/dashboard' className='link-primary fw-bolder'>
              {' '}
              Help Page
            </a>
            . */}
          </div>
        </div>

        <div className="fv-row">

          <div className="row">

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'CLAIM.LOCATION_EVENT' })}
              </label>

              <Field
                type="text"
                placeholder={intl.formatMessage({ id: 'CLAIM.LOCATION_EVENT' })}
                className="form-control bg-transparent"
                name="location_event"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="location_event" />
              </div>
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'SETTINGS.AGENCIES' })}
              </label>

              {agencyloader ? (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              ) : (
                <>
                  <Field
                    as="select"
                    name="agency_id"
                    className="form-control bg-transparent"
                  >
                    <option>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({ id: 'SETTINGS.AGENCY' })}
                    </option>

                    {agencyDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </Field>

                  {/* <div className="text-danger mt-2">
                    <ErrorMessage name="agency_id" />
                  </div> */}
                </>
              )}
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'CLAIM.DATE_EVENT' })}
              </label>

              <Field
                type="datetime-local"
                placeholder={intl.formatMessage({ id: 'CLAIM.DATE_EVENT' })}
                max={maxDate}
                className="form-control bg-transparent"
                name="date_event"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="date_event" />
              </div>
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'CLAIM.DATE_CLAIM_REPORT' })}
              </label>

              <Field
                type="datetime-local"
                max={maxDate}
                placeholder={intl.formatMessage({
                  id: 'CLAIM.DATE_CLAIM_REPORT',
                })}
                className="form-control bg-transparent"
                name="date_claim"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="date_claim" />
              </div>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.PRODUCT_NAME' })}
              </label>

              <Field
                type="text"
                placeholder={intl.formatMessage({ id: 'CLAIM.PRODUCT_NAME' })}
                className="form-control bg-transparent"
                name="product_name"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="product_name" />
              </div>
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
              </label>

              <Field
                type="number"
                placeholder={intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
                className="form-control bg-transparent"
                name="amount"
              />

              {/* <div className="text-danger mt-2">
                <ErrorMessage name="amount" />
              </div> */}
            </div>

            <div className="col-lg-4 mb-6">
              <label className="form-label mb-3">
                {intl.formatMessage({ id: 'CLAIM.CURRENCY' })}
              </label>

              {loaderCurrencyDatas ? (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              ) : (
                <>
                  <Field
                    as="select"
                    name="currency_id"
                    className="form-control bg-transparent"
                  >
                    <option>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({ id: 'CLAIM.CURRENCY' })}
                    </option>

                    {currencyDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </Field>

                  {/* <div className="text-danger mt-2">
                    <ErrorMessage name="currency_id" />
                  </div> */}
                </>
              )}
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'CLAIM.DESCRIPTION' })}
              </label>

              <Field
                as="textarea"
                name="description"
                placeholder={intl.formatMessage({ id: 'CLAIM.DESCRIPTION' })}
                className="form-control bg-transparent"
                rows={3}
              ></Field>

              <div className="text-danger mt-2">
                <ErrorMessage name="description" />
              </div>
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'CLAIM.EXPECT' })}
              </label>

              <Field
                as="textarea"
                name="expect"
                placeholder={intl.formatMessage({ id: 'CLAIM.EXPECT' })}
                className="form-control bg-transparent"
                rows={3}
              ></Field>

              <div className="text-danger mt-2">
                <ErrorMessage name="expect" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </>

  );

};

export { NewClaimStep2BasicDatas };
