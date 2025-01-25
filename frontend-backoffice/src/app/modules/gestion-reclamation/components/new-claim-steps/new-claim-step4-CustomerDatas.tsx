/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useIntl } from 'react-intl';
import { CustomerModel } from '../../../gestion-customer/core/models/Customer';
import { CustomerRequest } from '../../../gestion-customer/core/services/CustomerRequests';
import { CustomerTypeRequest } from '../../../gestion-customer/core/services/CustomerTypeRequests';
import { CustomerTypeModel } from '../../../gestion-customer/core/models/CustomerType';
import { LOADER_INPUTLOADER } from '../../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { getGenderAvatar, handleHttpError } from '../../../../utils/functions';
import { Autocomplete, Box, LinearProgress, TextField } from '@mui/material';
import { CustomerDatas } from './new-claim-steps-sub-components/customerDatas';
import { KTSVG } from '../../../../../_metronic/helpers/components/KTSVG';
import clsx from 'clsx';

const NewClaimStep4CustomerDatas: FC<any> = (props) => {
  const intl = useIntl();

  const customerRequest = new CustomerRequest();
  const customerTypeRequest = new CustomerTypeRequest();

  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const institutionId = user_datas.unity.institution.id

  const [NewClaimStep4customerDatas, setNewClaimStep4customerDatas] = useState(
    Array<CustomerModel | any>,
  );
  const [selectedCustomerDatas, setselectedCustomerDatas] =
    useState<CustomerModel>();

  const [customerTypeDatas, setcustomerTypeDatas] = useState(
    Array<CustomerTypeModel | any>,
  );
  const [loaderCustomersTypeDatas, setloaderCustomersTypeDatas] =
    useState(false);

  const [newCustomer, setNewCustomer] = useState('0');
  const [loaderCustomersDatas, setLoaderCustomersDatas] = useState(false);

  const [isUpdating, setisUpdating] = useState(false);
  const [customerDatas, setcustomerDatas] = useState<CustomerTypeModel | any>();

  const [customerType, setcustomerType] = useState();

  const { errors, touched, validateField, setFieldTouched } = useFormikContext();

  const userExistedVal = [
    {
      name: 'GEN.NO',
      val: '2',
    },
    {
      name: 'GEN.YES',
      val: '1',
    },
  ];

  const getCustumerList = async () => {
    await customerRequest
      .getCustumerList(0, 10, institutionId)
      .then((response: any) => {
        setNewClaimStep4customerDatas(response.data.items);
        setLoaderCustomersDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getFilteredCustumerListByName = async (event: any) => {
    event.preventDefault();

    const _key = event.target.value;

    setLoaderCustomersDatas(true);

    await customerRequest
      .getFilteredCustumerListByName(_key)
      .then((response: any) => {
        console.log(response.data);
        setNewClaimStep4customerDatas(response.data);
        setLoaderCustomersDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const selectCustomer = async (customerDatas: any) => {
    // affect customer data selected
    setselectedCustomerDatas(customerDatas);
    // save selected customer datas
    props._saveCustomerDatas(customerDatas);
    // update newClaim whole form data by : customer_id
    props._updateCustumDatas({ customer_id: customerDatas.id });
  };

  const getCustumerTypeList = async () => {
    setloaderCustomersTypeDatas(true);

    await customerTypeRequest
      .getCustumerTypeList(0, 10)
      .then((response: any) => {
        setcustomerTypeDatas(response.data.items);
        setloaderCustomersTypeDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const changeCustomerType = ($event: any) => {
    // 2 : PHYSIQUE, 1: MORAL
    if (
      $event?.type &&
      $event.type === 'change' &&
      $event.target.name === 'customer_type_id'
    ) {
      setcustomerType($event.target.value)
      props._saveCustomerTypeDatas($event.target.value);
      console.log('cutomer type selected', $event.target.value)
    }
  };

  const isNewUser = ($event: any) => {
    if (
      $event?.type &&
      $event.type === 'change' &&
      $event.target.name === 'isNewUser'
    ) {

      // event to change newClaim form setting when is new customer or when selected old customer
      //@ts-ignore
      props.newDatasSendForCustumSchema($event.target.value);
      // update newClaim whole form data by : isNewUser
      props._updateCustumDatas({ isNewUser: $event.target.value });

      // if new user choice is marked
      if ($event.target.value == 1) {
        getCustumerTypeList();
        setNewCustomer('1');
      }
      // if old user choice is marked
      else {
        setNewCustomer('2');
      }
    } else {
      getCustumerTypeList();
    }
  };

  useEffect(() => {

    getCustumerTypeList()

    if (props.isUpdating) {
      setisUpdating(props.isUpdating);
      setcustomerDatas(props._customerDatas);
    }
    if (props.savedSelectedCustomerDatas) {
      console.log(props.savedSelectedCustomerDatas)
      setselectedCustomerDatas(props.savedSelectedCustomerDatas);
    }
    if (props.isNewUser) {
      setNewCustomer(props.isNewUser);
    }
    if (props.savedCustomerTypeDatas) {
      setcustomerType(props.savedCustomerTypeDatas);

      // change newCustomer form setting according to when it's MORAL or PHYSIQUE customer type
      props._saveCustomerTypeDatas(props.savedCustomerTypeDatas)
    }
  }, []);

  return (
    <>
      {/* filter customer modal */}
      <div className="modal fade" tabIndex={-1} id="filter_customer_modal">
        <div className="modal-dialog modal-lg" role="document">
          <form className="form" noValidate>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'USER.SEARCH_CUSTOMER' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-CLOSER"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({
                      id: 'USER.TYPE_FIRSTNAME_OR_LASTNAME',
                    })}
                  </label>

                  <input
                    type="text"
                    placeholder={intl.formatMessage({
                      id: 'GEN.FILTER_PLACEHOLDER',
                    })}
                    className="w-100 form-control bg-transparent"
                    onChange={(event: any) =>
                      getFilteredCustumerListByName(event)
                    }
                  />
                </div>

                <div
                  className="fv-row mb-8 w-100 border-dashed border-primary border-active-secondary p-4"
                  style={{
                    borderRadius: '6px',
                    overflowY: 'scroll',
                    height: '29rem',
                  }}
                >
                  {loaderCustomersDatas && <LinearProgress color="primary" />}

                  {NewClaimStep4customerDatas?.map((row, index) => (
                    <>
                      <div className="p-5 row">
                        <input
                          className="form-check-input me-3 mt-5 col-1"
                          name="customer_id"
                          type="radio"
                          value={row.id}
                          onClick={() => selectCustomer(row)}
                          id={`kt_modal_affect_new_role_option_${index}`}
                        />

                        <label
                          className="form-check-label col-11 row required"
                          htmlFor={`kt_modal_affect_new_role_option_${index}`}
                          onClick={() => selectCustomer(row)}
                        >
                          <div className="d-flex align-items-center col-6">
                            <div className="symbol symbol-45px me-5">
                              <img
                                src={getGenderAvatar(row.profile?.sex)}
                                alt=""
                              />
                            </div>

                            <div className="d-flex justify-content-start flex-column">
                              <a className="text-gray-900 fw-bold text-hover-primary fs-6">
                                {row.profile?.first_name}{' '}
                                {row.profile?.last_name} ::{' '}
                                {row.customer_type?.libelle}
                              </a>
                              <span className="text-muted fw-semibold text-muted d-block fs-16">
                                <a> ID : {row.account_number}</a>
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center col-6">
                            <div className="d-flex justify-content-start flex-column">
                              <a className="text-gray-900 fw-bold text-hover-primary fs-6">
                                {row.profile?.department} / {row.profile?.city}{' '}
                                / {row.profile?.address}
                              </a>
                              <span className="text-muted fw-semibold text-muted d-block fs-16">
                                <a
                                >
                                  {row.profile?.email ? row.profile?.email : ''}
                                </a>{' '}
                                /{' '}
                                <a
                                >
                                  {row.profile?.telephone
                                    ? row.profile?.telephone
                                    : ''}
                                </a>
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </>
                  ))}

                  {!loaderCustomersDatas &&
                    NewClaimStep4customerDatas.length == 0 && (
                      <h3 className="text-center">
                        {' '}
                        {intl.formatMessage({
                          id: 'USER.NO_CUSTOMER_WITH_THESE_KEY',
                        })}{' '}
                      </h3>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-dismiss="modal"
                  disabled={!selectedCustomerDatas}
                >
                  <span className="indicator-label">
                    {intl.formatMessage({ id: 'GEN.VALID' })}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* filter customer modal end */}

      <div className="w-100">
        <div className="pb-10 pb-lg-12">
          <h2 className="fw-bolder text-gray-900">
            {intl.formatMessage({ id: 'CLAIM.CUSTOMER_DATAS' })}
          </h2>

          <div className="text-gray-500 fw-bold fs-6">
            {isUpdating
              ? intl.formatMessage({
                  id: 'CLAIM.CUSTOMER_DATAS_DESCRIPTION_REVIEW',
                })
              : intl.formatMessage({ id: 'CLAIM.CUSTOMER_DATAS_DESCRIPTION' })}
            {/* <a href='/dashboard' className='link-primary fw-bolder'>
              {' '}
              Help Page
            </a>
            . */}
          </div>
        </div>

        {isUpdating && customerDatas ? (
          // to show only when in complete claim process
          <CustomerDatas customerDatas={customerDatas} />
        ) : (
          // to show on when adding claim
          <div className="fv-row">
            <div className="row">
              <div className="col-lg-3 mb-6">
                <label className="form-label mb-3 required">
                  {intl.formatMessage({ id: 'CUSTOMER.CUSTOMER_ADD' })} ?
                </label>

                <div className="row mb-2" data-kt-buttons="true">
                  <Field
                    as="select"
                    name="isNewUser"
                    onChange={() => isNewUser(event)}
                    className="form-control bg-transparent"
                  >
                    <option>{intl.formatMessage({ id: 'GEN.CHOOSE' })}</option>

                    {userExistedVal?.map((row, index) => (
                      <option key={index} value={row.val}>
                        {intl.formatMessage({ id: row.name })}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              {newCustomer === '2' ? (
                <>
                <div className="col-lg-9 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'GEN.SELECT_CUSTUMER' })}
                  </label>

                  <button
                    type="button"
                    className="btn btn-white btn-outline btn-outline-solid btn-outline-primary
                                      width-100 "
                    data-bs-toggle="modal"
                    data-bs-target="#filter_customer_modal"
                  >
                    {intl.formatMessage({ id: 'USER.PLEASE_SELECT_CUSTOMER' })}
                  </button>
                </div>

              <div className="col-12">
                {/* when existed user is selected in update claim process */}
                {selectedCustomerDatas && (
                  <CustomerDatas customerDatas={selectedCustomerDatas} />
                )}
              </div>

                </>
              ) : (
                ''
              )}

            </div>

            {newCustomer === '1' ? (
              <div className="row">
                <div className="col-lg-12 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.CUSTOMER_TYPE' })}
                  </label>

                  {loaderCustomersTypeDatas ? (
                    <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                  ) : (
                    <>
                      <Field
                        as="select"
                        placeholder={intl.formatMessage({
                          id: 'USER.CUSTOMER_TYPE',
                        })}
                        className="form-control bg-transparent"
                        name="customer_type_id"
                        value={customerType}
                        onChange={() => changeCustomerType(event)}
                      >
                        <option selected={true}>
                          {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                            ' ' +
                            intl.formatMessage({ id: 'USER.CUSTOMER_TYPE' })}
                        </option>

                        {customerTypeDatas?.map((row, index) => (
                          <option key={index} value={row.id}>
                            {row.libelle}
                          </option>
                        ))}
                      </Field>
                      {
                        customerType != '1' && customerType != '2' && <h4 className="text-danger mt-2">Veuillez selectionner le type de client</h4>
                      }
                    </>
                  )}
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                  </label>

                  <Field
                    type="text"
                    placeholder={intl.formatMessage({ id: 'USER.FIRSTNAME' })}
                    className="form-control bg-transparent"
                    name="newCustomerFirstname"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                       props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerFirstname'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerFirstname && props.formsTouchedDatas.newCustomerFirstname && (
                    <ErrorMessage name="newCustomerFirstname" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.LASTNAME' })}
                  </label>

                  <Field
                    type="text"
                    placeholder={intl.formatMessage({ id: 'USER.LASTNAME' })}
                    className="form-control bg-transparent"
                    name="newCustomerLastname"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerLastname'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerLastname && props.formsTouchedDatas.newCustomerLastname && (
                    <ErrorMessage name="newCustomerLastname" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.SEXE' })}
                  </label>

                  <Field
                    as="select"
                    placeholder={intl.formatMessage({ id: 'USER.SEXE' })}
                    className="form-control bg-transparent"
                    name="newCustomerSexe"
                  >
                    <option selected={true}>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        ' ' +
                        intl.formatMessage({ id: 'USER.SEXE' })}
                    </option>
                    <option value="M">
                      {intl.formatMessage({ id: 'USER.MALE' })}
                    </option>
                    <option value="F">
                      {intl.formatMessage({ id: 'USER.FEMALE' })}
                    </option>
                  </Field>
                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerSexe'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerSexe && props.formsTouchedDatas.newCustomerSexe && (
                    <ErrorMessage name="newCustomerSexe" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.CITY' })}
                  </label>

                  <Field
                    type="text"
                    placeholder={intl.formatMessage({ id: 'USER.CITY' })}
                    className="form-control bg-transparent"
                    name="newCustomerCity"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerCity'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerCity && props.formsTouchedDatas.newCustomerCity && (
                    <ErrorMessage name="newCustomerCity" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.PHONE' })}
                  </label>

                  <Field
                    type="tel"
                    placeholder={intl.formatMessage({ id: 'USER.PHONE' })}
                    className="form-control bg-transparent"
                    name="newCustomerPhone"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerPhone'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerPhone && props.formsTouchedDatas.newCustomerPhone && (
                    <ErrorMessage name="newCustomerPhone" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'USER.EMAIL' })}
                  </label>

                  <Field
                    type="email"
                    placeholder={intl.formatMessage({ id: 'USER.EMAIL' })}
                    className="form-control bg-transparent"
                    name="newCustomerEmail"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['newCustomerEmail'] } </span>
                    } */}
                    {props.formsErrorsDatas.newCustomerEmail && props.formsTouchedDatas.newCustomerEmail && (
                    <ErrorMessage name="newCustomerEmail" />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 mb-6">
                  <label className="form-label mb-3">
                    {intl.formatMessage({ id: 'USER.ACCOUNT_NUMBER' })}
                  </label>

                  <Field
                    type="text"
                    placeholder={intl.formatMessage({
                      id: 'USER.ACCOUNT_NUMBER',
                    })}
                    className="form-control bg-transparent"
                    name="account_number"
                  />

                  <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['account_number'] } </span>
                    } */}
                    {props.formsErrorsDatas.account_number && props.formsTouchedDatas.account_number && (
                    <ErrorMessage name="account_number" />
                    )}
                  </div>
                </div>

                {
                  customerType == '1' &&
                  <>

                  <div className="col-lg-6 mb-6">
                    <label className="form-label mb-3 required">
                      {intl.formatMessage({ id: 'USER_ACCOUNT.COMPANY_NAME' })}
                    </label>
  
                    <Field
                      type="text"
                      placeholder={intl.formatMessage({
                        id: 'USER_ACCOUNT.COMPANY_NAME',
                      })}
                      className="form-control bg-transparent"
                      name="company_name"
                    />
  
                    <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['company_name'] } </span>
                    } */}
                    {props.formsErrorsDatas.company_name && props.formsTouchedDatas.company_name && (
                    <ErrorMessage name="company_name" />
                    )}
                    </div>
                  </div>
  
                  <div className="col-lg-6 mb-6">
                    <label className="form-label mb-3">
                      {intl.formatMessage({ id: 'USER_ACCOUNT.IFU' })}
                    </label>
  
                    <Field
                      type="text"
                      placeholder={intl.formatMessage({
                        id: 'USER_ACCOUNT.IFU',
                      })}
                      className="form-control bg-transparent"
                      name="ifu"
                    />
  
                    <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['ifu'] } </span>
                    } */}
                    {props.formsErrorsDatas.ifu && props.formsTouchedDatas.ifu && (
                    <ErrorMessage name="ifu" />
                    )}
                    </div>
                  </div>
  
                  <div className="col-lg-6 mb-6">
                    <label className="form-label mb-3 required">
                      {intl.formatMessage({ id: 'USER_ACCOUNT.LOCATION' })}
                    </label>
  
                    <Field
                      type="text"
                      placeholder={intl.formatMessage({
                        id: 'USER_ACCOUNT.LOCATION',
                      })}
                      className="form-control bg-transparent"
                      name="location"
                    />
  
                    <div className="text-danger mt-2">
                    {/* {
                      props.customerDatasErrors && <span>{ props.customerDatasErrors['location'] } </span>
                    } */}
                    {props.formsErrorsDatas.location && props.formsTouchedDatas.location && (
                    <ErrorMessage name="location" />
                    )}
                    </div>
                  </div>
                  
                  </>
                }



              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    </>
  );
};

export { NewClaimStep4CustomerDatas };
