/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { ErrorMessage, Field } from 'formik';
import { useIntl } from 'react-intl';
import { ReceivingChannelRequest } from '../../../gestion-paramettres/core/services/ReceivingChannelRequests';
import { ResponseChannelRequest } from '../../../gestion-paramettres/core/services/ResponseChannelRequests';
// import { StatusRequest } from '../../../gestion-paramettres/core/services/StatusRequests'
// import { InstitutionRequest } from '../../../gestion-paramettres/core/services/InstitutionRequests'
import { ResponseChannelModel } from '../../../gestion-paramettres/core/models/ResponseChannel';
import { ReceivingChannelModel } from '../../../gestion-paramettres/core/models/ReceivingChannel';
import { LOADER_INPUTLOADER } from '../../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { handleHttpError } from '../../../../utils/functions';
// import { StatusModel } from '../../../gestion-paramettres/core/models/Status'
// import { InstitutionModel } from '../../../gestion-paramettres/core/models/Institution'
// import { ComplaintCategoryRequest } from '../../../gestion-paramettres/core/services/ComplaintsCategoryRequest'

const NewClaimStep3AdvancedDatas: FC<any> = () => {
  const intl = useIntl();

  const receivingChannelRequest = new ReceivingChannelRequest();
  const responseChannelRequest = new ResponseChannelRequest();
  // const statusRequest = new StatusRequest()
  // const institutionRequest = new InstitutionRequest()
  // const complaintCategoriesRequest = new ComplaintCategoryRequest()

  const [receivingChannelDatas, setreceivingChannelDatas] = useState(
    Array<ReceivingChannelModel>,
  );
  const [responseChannelDatas, setresponseChannelDatas] = useState(
    Array<ResponseChannelModel>,
  );

  const [loaderReceivingChannelDatas, setLoaderReceivingChannelDatas] =
    useState(true);
  const [loaderResponseChannelDatas, setLoaderResponseChannelDatas] =
    useState(true);

  const reminderVal = [
    {
      text: `${intl.formatMessage({ id: 'GEN.YES' })}`,
      val: 1,
    },
    {
      text: `${intl.formatMessage({ id: 'GEN.NO' })}`,
      val: 0,
    },
  ];

  const getReceivingChannelList = async () => {
    await receivingChannelRequest
      .getReceivingChannelList()
      .then((response: any) => {
        setreceivingChannelDatas(response.data.items);
        setLoaderReceivingChannelDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getResponseChannelList = async () => {
    await responseChannelRequest
      .getResponseChannelList()
      .then((response: any) => {
        setresponseChannelDatas(response.data.items);
        setLoaderResponseChannelDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getReceivingChannelList();
    getResponseChannelList();
  }, []);

  return (
    <>
      <div className="w-100">
        <div className="pb-10 pb-lg-15">
          <h2 className="fw-bolder text-gray-900">
            {intl.formatMessage({ id: 'CLAIM.ADVANCED_DATAS' })}
          </h2>

          <div className="text-gray-500 fw-bold fs-6">
            {intl.formatMessage({ id: 'CLAIM.ADVANCED_DATAS_DESCRIPTION' })}
          </div>
        </div>

        <div className="fv-row">
          <div className="row">
            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'SETTINGS.RECEIVING_CHANNEL' })}
              </label>

              {loaderReceivingChannelDatas ? (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              ) : (
                <>
                  <Field
                    as="select"
                    name="reception_channel_id"
                    className="form-control bg-transparent"
                  >
                    <option value={0}>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({
                          id: 'SETTINGS.RECEIVING_CHANNEL',
                        })}
                    </option>

                    {receivingChannelDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </Field>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="reception_channel_id" />
                  </div>
                </>
              )}
            </div>

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'SETTINGS.RESPONSE_CHANNEL' })}
              </label>

              {loaderResponseChannelDatas ? (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              ) : (
                <>
                  <Field
                    as="select"
                    name="response_channel_id"
                    className="form-control bg-transparent"
                  >
                    <option value={0}>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({ id: 'SETTINGS.RESPONSE_CHANNEL' })}
                    </option>

                    {responseChannelDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </Field>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="response_channel_id" />
                  </div>
                </>
              )}
            </div>

            {/* <div className='col-lg-6 mb-6'>
                  
                    <label className='form-label mb-3'>{intl.formatMessage({id: 'SETTINGS.INSTITUTION'})}</label>
                               
                    <Field
                      as='select'
                      name='institution_id'
                      className='form-control bg-transparent'
                    >
                      <option>{intl.formatMessage({id: 'GEN.CHOOSE'}) + intl.formatMessage({id: 'SETTINGS.INSTITUTION'})}</option>
                      
                      {institutionDatas?.map((row, index) => (
        
                        <option key={index} value={row.id}>{row.name}</option>
                            
                      ))}

                    </Field>

                    <div className='text-danger mt-2'>
                      <ErrorMessage name='institution_id' />
                    </div>

                  </div> */}

            <div className="col-lg-6 mb-6">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'GEN.IS_REPEAT' })}
              </label>

              <Field
                as="select"
                name="is_reminder"
                className="form-control bg-transparent"
              >
                <option value={''}>{intl.formatMessage({ id: 'GEN.CHOOSE' })}</option>

                {reminderVal?.map((row, index) => (
                  <option key={index} value={row.val}>
                    {row.text}
                  </option>
                ))}
              </Field>

              <div className="text-danger mt-2">
                <ErrorMessage name="is_reminder" />
              </div>

              {/* <div className='row mb-2' data-kt-buttons='true'>

                      <div className='col-6'>
                        <Field
                          type='radio'
                          className='btn-check'
                          name='is_reminder'
                          value='false'
                          id='kt_account_team_size_select_1'
                        />
                        <label
                          className='btn btn-outline btn-outline-dashed btn-outline-default w-100'
                          htmlFor='kt_account_team_size_select_1'
                        >
                          <span className='fw-bolder fs-3'>{intl.formatMessage({id: 'GEN.NO'})}</span>
                        </label>
                      </div>

                      <div className='col-6'>
                        <Field
                          type='radio'
                          className='btn-check'
                          name='is_reminder'
                          value='true'
                          id='kt_account_team_size_select_2'
                        />
                        <label
                          className='btn btn-outline btn-outline-dashed btn-outline-default w-100'
                          htmlFor='kt_account_team_size_select_2'
                        >
                          <span className='fw-bolder fs-3'>{intl.formatMessage({id: 'GEN.YES'})}</span>
                        </label>
                      </div>

                    </div>

                    <div className='text-danger mt-2'>
                      <ErrorMessage name='is_reminder' />
                    </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { NewClaimStep3AdvancedDatas };
