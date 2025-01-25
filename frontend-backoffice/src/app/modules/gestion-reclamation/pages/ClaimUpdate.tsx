/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { KTIcon } from '../../../../_metronic/helpers';
import { Form, Formik, FormikValues } from 'formik';
import { PageTitle } from '../../../../_metronic/layout/core';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

import { ClaimModel } from '../core/models/Claim';

import { CustomerRequest } from '../../gestion-customer/core/services/CustomerRequests';
import { ClaimRequest } from '../core/services/ClaimRequest';
import { useNavigate, useParams } from 'react-router-dom';
import { NewClaimStep1InsurranceDatas } from '../components/new-claim-steps/new-claim-step1-InsurranceDatas';
import { NewClaimStep2BasicDatas } from '../components/new-claim-steps/new-claim-step2-BasicDatas';
import { NewClaimStep3AdvancedDatas } from '../components/new-claim-steps/new-claim-step3-AdvancedDatas';
import { NewClaimStep4CustomerDatas } from '../components/new-claim-steps/new-claim-step4-CustomerDatas';
import { NewClaimStep5ProofsDatas } from '../components/new-claim-steps/new-claim-step5-ProofsDatas';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import {
  _toISOString,
  handleHttpError,
  toISOString,
} from '../../../utils/functions';
import { StepperComponentForUpdateClaim } from '../../../../_metronic/assets/ts/components/_StepperComponentForUpdateClaim';
import { StepperComponent } from '../../../../_metronic/assets/ts/components';
import { CustomerTypeModel } from '../../gestion-customer/core/models/CustomerType';

interface MoreDatas {
  category_id: string;
  isNewUser: string;
  object_id: string;
}

const ClaimUpdate = () => {
  const intl = useIntl();

  const [claimShema, setClaimShema] = useState([
    Yup.object({
      // product_id: Yup.number()
      // .required('Product is required'),
      // insurrance_type_id: Yup.number()
      //   .required('Insurrance Type is required'),
      // type_id: Yup.number()
      // .required('Claim Type Type is required'),
      // category_id: Yup.number()
      // .required('Category is required'),
      object_id: Yup.number().required('Object is required'),
    }),

    Yup.object({
      location_event: Yup.string().required('Location Event is required'),
      date_event: Yup.string().required('Event date is required'),
      date_claim: Yup.string().required('Claim date is required'),
      description: Yup.string().required('Descrition is required'),
      product_name: Yup.string(),
      // .required('Produit requis'),
      amount: Yup.number(),
      currency_id: Yup.number(),
      agency_id: Yup.number(),
      expect: Yup.string().required('Exeptation is required'),
    }),

    Yup.object({
      reception_channel_id: Yup.number().required(
        'Reception channel is required',
      ),
      response_channel_id: Yup.number().required(
        'Response channel is required',
      ),
      institution_id: Yup.number().required('institution is required'),
      is_reminder: Yup.boolean().required('Reminder is required'),
    }),

    Yup.object().shape({
      location: Yup.string(),
    }),

    Yup.object({
      file: Yup.string(),
    }),
  ]);

  const navigate = useNavigate();

  const customerRequest = new CustomerRequest();
  const claimRequest = new ClaimRequest();

  const stepperRef = useRef<HTMLDivElement | null>(null);
  // const [ stepper, setStepper ] = useState<StepperComponentForUpdateClaim | null>(null)
  const [stepper, setStepper] = useState<StepperComponent | null | any>(null);
  const [currentSchema, setCurrentSchema] = useState(claimShema[0]);
  const [claim, setClaim] = useState<ClaimModel | any>();
  const [claimloader, setClaimloader] = useState(true);
  const [currentStepIndex, setcurrentStepIndex] = useState(1);

  const claimId: any = useParams()['claim_id'];

  const [claimProofs, setClaimProofs] = useState(new Array<number>());

  const [addingClaim, setAddingClaim] = useState(false);

  const [isProofsFilesSelected, setisProofsFilesSelected] = useState(false);
  const [startProofFilesUploading, setstartProofFilesUploading] =
    useState(false);

  const [moreDatas, setMoreDatas] = useState<MoreDatas>();

  const [_initialValues, setinitialValues] = useState(new ClaimModel());

  const [customerDatas, setcustomerDatas] = useState<CustomerTypeModel | any>();
  // const [existingProofsFiles, setExistingProofsFiles] = useState(new ClaimModel())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goBackToCompletedClaimsList = () => {
    navigate('/claims/completed');
  };

  const loadStepper = () => {
    // setStepper(StepperComponentForUpdateClaim.createInsance(stepperRef.current as HTMLDivElement))
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement),
    );
  };

  const prevStep = () => {
    if (!stepper) {
      return;
    }

    stepper.goPrev();

    setCurrentSchema(claimShema[stepper?.currentStepIndex - 1]);
  };

  // to mark if proof files is selected or not
  const proofsFilesFilesIsSelected = (_data: any) => {
    setisProofsFilesSelected(_data);
  };

  // to start proof files uploading
  const startProofFileUpload = () => {
    // tell NewClaimStep5_ProofDatas component that it can start files upload
    setstartProofFilesUploading(true);
  };

  // set uploaded proofs files datas
  const proofFilesUploadDone = (_data: any) => {
    console.log(_data);

    setClaimProofs(_data);

    setTimeout(() => {
      updateClaim(claim, _data);
    }, 1000);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const submitStep = (values: ClaimModel, actions: FormikValues) => {
    if (!stepper) {
      return;
    }

    if (stepper?.currentStepIndex < stepper?.totalStepsNumber) {
      stepper.goNext();
    } else if (stepper?.currentStepIndex == stepper?.totalStepsNumber) {
      setClaim(values);

      setAddingClaim(true);

      // if it's a new customer
      if (moreDatas?.isNewUser == '1') {
        addNewCustomer(values);
      }
      // if not
      else {
        // if new file(s) are selected
        if (isProofsFilesSelected) {
          startProofFileUpload();
        } else {
          updateClaim(
            values,
            claimProofs.map((proof: any) => proof.id),
          );
        }
      }
    }

    setCurrentSchema(claimShema[stepper?.currentStepIndex + 1]);

    setcurrentStepIndex(stepper?.currentStepIndex)

  };

  const updateClaim = async (val = claim, proofsList = claimProofs) => {
    //@ts-ignore
    const _claimDateEvent = new Date(val.date_event);

    const _claim = {
      ...claim,
      ...{
        location_event: val.location_event,
        //@ts-ignore
        date_event: toISOString(val.date_event),
        //@ts-ignore
        date_claim: toISOString(val.date_claim),
        // 'date_claim': new Date(_claimDateEvent.date_claim),
        // "date_event": `${_claimDateEvent.getFullYear()}-${(_claimDateEvent.getMonth() + 1).toString().padStart(2, '0')}-${_claimDateEvent.getDate().toString().padStart(2, '0')}T${_claimDateEvent.getHours().toString().padStart(2, '0')}:${_claimDateEvent.getMinutes().toString().padStart(2, '0')}`,
        description: val.description,
        expect: val.expect,
        amount: val.amount,
        is_reminder: val.is_reminder ? true : false,
        customer_id: val.customer_id,
        reception_channel_id: val.reception_channel_id,
        response_channel_id: val.response_channel_id,
        product_name: val.product_name ?? '',
        status_id: 2,
        currency_id: val.currency_id,
        agency_id: val.agency_id,
        object_id: val.object_id,
      },
    };

    console.log(_claim, proofsList);

    await claimRequest
      .completeClaim(_claim, proofsList)
      .then((response: any) => {
        goBackToCompletedClaimsList();
        notificationSuccessToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.COMPLETED.SUCCESS' }),
          5000,
        );
      })
      .catch((error: any) => {
        notificationErrorToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.COMPLETED.ERROR' }),
          5000,
        );
        handleHttpError(error);
      });
  };

  const addNewCustomer = async (val: any) => {
    const customer = {
      profile: {
        last_name: val.newCustomerLastname,
        first_name: val.newCustomerFirstname,
        sex: val.newCustomerSexe,
        city: val.newCustomerCity,
        telephone: val.newCustomerPhone,
        email: val.newCustomerEmail,
      },
      customer: {
        account_number: val.account_number,
      },
      customer_type_id: val.customer_type_id,
    };

    await customerRequest
      .addCustumer(customer)
      .then((response: any) => {
        if (response.status === 200) {
          const _val = {
            ...val,
            ...{ customer_id: response.data.id },
          };

          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CUSTOMER_NOTIFS.ADDING.SUCCESS' }),
            5000,
          );

          if (isProofsFilesSelected) {
            startProofFileUpload();
          } else {
            updateClaim(
              _val,
              claimProofs.map((proof: any) => proof.id),
            );
            setClaim(_val);
          }
        }
      })
      .catch((error: any) => {
        notificationErrorToast(
          intl.formatMessage({ id: 'NOTIFS.CUSTOMER_NOTIFS.ADDING.ERROR' }),
          5000,
        );
      });
  };

  const updatemoreDatas = (_data: any) => {
    setMoreDatas({ ...moreDatas, ..._data });

    setTimeout(() => {
      console.log(moreDatas);
    }, 1000);
  };

  const getClaimById = async (claimId: number) => {
    setClaimloader(true);

    await claimRequest
      .getClaimById(claimId)
      .then((res: any) => {
        const _claimDatas = res.data;
        console.log(_claimDatas);

        setClaimProofs(_claimDatas.proofs);
        setcustomerDatas(_claimDatas.customer);

        setClaimloader(false);

        const _claim = {
          id: _claimDatas.id,
          reference: _claimDatas.reference,
          location_event: _claimDatas.location_event,
          date_event: _toISOString(_claimDatas.date_event),
          date_claim: _toISOString(_claimDatas.date_claim),
          description: _claimDatas.description,
          expect: _claimDatas.expect,
          amount: _claimDatas.amount,
          is_reminder: _claimDatas.is_reminder ? 1 : 0,
          reception_channel_id: _claimDatas.reception_channel.id,
          response_channel_id: _claimDatas.response_channel.id,
          currency_id: _claimDatas.currency ? _claimDatas.currency.id : null,
          institution_id: _claimDatas.institution.id,
          object_id: _claimDatas.object.id,
          category_id: _claimDatas.object.category.id,
          customer_id: _claimDatas.customer.id,
        };

        //@ts-ignore
        setinitialValues(_claim);
        // _initialValues = _claim;
        console.log(_claim);
        setClaim(_claim);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();

    getClaimById(claimId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepperRef]);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'CLAIM.UPDATING' })}
      </PageTitle>

      <div
        ref={stepperRef}
        className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
        id="kt_create_account_stepper"
      >
        {claimloader ? (
          <>
            <h1 className="col-12 text-center mt-7">Loading...</h1>
          </>
        ) : (
          <>
            {/* begin::Aside*/}
            <div className="card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9">
              {/* begin::Wrapper*/}
              <div className="card-body px-6 px-lg-10 px-xxl-15 py-20">
                {/* begin::Nav*/}
                <div className="stepper-nav">
                  {/* begin::Step 1*/}
                  <div
                    className="stepper-item current"
                    data-kt-stepper-element="nav"
                  >
                    {/* begin::Wrapper*/}
                    <div className="stepper-wrapper">
                      {/* begin::Icon*/}
                      <div className="stepper-icon w-40px h-40px">
                        <i className="stepper-check fas fa-check"></i>
                        <span className="stepper-number">1</span>
                      </div>
                      {/* end::Icon*/}

                      {/* begin::Label*/}
                      <div className="stepper-label">
                        <h3 className="stepper-title">
                          {intl.formatMessage({ id: 'CLAIM.INSURRANCE_DATAS' })}
                        </h3>

                        <div className="stepper-desc fw-semibold">
                          {intl.formatMessage({
                            id: 'CLAIM.INSURRANCE_DATAS_DESCRIPTION',
                          })}
                        </div>
                      </div>
                      {/* end::Label*/}
                    </div>
                    {/* end::Wrapper*/}

                    {/* begin::Line*/}
                    <div className="stepper-line h-40px"></div>
                    {/* end::Line*/}
                  </div>
                  {/* end::Step 1*/}

                  {/* begin::Step 2*/}
                  <div className="stepper-item" data-kt-stepper-element="nav">
                    {/* begin::Wrapper*/}
                    <div className="stepper-wrapper">
                      {/* begin::Icon*/}
                      <div className="stepper-icon w-40px h-40px">
                        <i className="stepper-check fas fa-check"></i>
                        <span className="stepper-number">2</span>
                      </div>
                      {/* end::Icon*/}

                      {/* begin::Label*/}
                      <div className="stepper-label">
                        <h3 className="stepper-title">
                          {intl.formatMessage({ id: 'CLAIM.BASIC_DATAS' })}
                        </h3>

                        <div className="stepper-desc fw-semibold">
                          {intl.formatMessage({
                            id: 'CLAIM.BASIC_DATAS_DESCRIPTION',
                          })}
                        </div>
                      </div>
                      {/* end::Label*/}
                    </div>
                    {/* end::Wrapper*/}

                    {/* begin::Line*/}
                    <div className="stepper-line h-40px"></div>
                    {/* end::Line*/}
                  </div>
                  {/* end::Step 2*/}

                  {/* begin::Step 3*/}
                  <div className="stepper-item" data-kt-stepper-element="nav">
                    {/* begin::Wrapper*/}
                    <div className="stepper-wrapper">
                      {/* begin::Icon*/}
                      <div className="stepper-icon w-40px h-40px">
                        <i className="stepper-check fas fa-check"></i>
                        <span className="stepper-number">3</span>
                      </div>
                      {/* end::Icon*/}

                      {/* begin::Label*/}
                      <div className="stepper-label">
                        <h3 className="stepper-title">
                          {intl.formatMessage({ id: 'CLAIM.ADVANCED_DATAS' })}
                        </h3>
                        <div className="stepper-desc fw-semibold">
                          {intl.formatMessage({
                            id: 'CLAIM.ADVANCED_DATAS_DESCRIPTION',
                          })}
                        </div>
                      </div>
                      {/* end::Label*/}
                    </div>
                    {/* end::Wrapper*/}

                    {/* begin::Line*/}
                    <div className="stepper-line h-40px"></div>
                    {/* end::Line*/}
                  </div>
                  {/* end::Step 3*/}

                  {/* begin::Step 4*/}
                  <div className="stepper-item" data-kt-stepper-element="nav">
                    {/* begin::Wrapper*/}
                    <div className="stepper-wrapper">
                      {/* begin::Icon*/}
                      <div className="stepper-icon w-40px h-40px">
                        <i className="stepper-check fas fa-check"></i>
                        <span className="stepper-number">4</span>
                      </div>
                      {/* end::Icon*/}

                      {/* begin::Label*/}
                      <div className="stepper-label">
                        <h3 className="stepper-title">
                          {intl.formatMessage({ id: 'CLAIM.CUSTOMER_DATAS' })}
                        </h3>
                        <div className="stepper-desc fw-semibold">
                          {intl.formatMessage({
                            id: 'CLAIM.CUSTOMER_DATAS_DESCRIPTION_REVIEW',
                          })}
                        </div>
                      </div>
                      {/* end::Label*/}
                    </div>
                    {/* end::Wrapper*/}

                    {/* begin::Line*/}
                    <div className="stepper-line h-40px"></div>
                    {/* end::Line*/}
                  </div>
                  {/* end::Step 4*/}

                  {/* begin::Step 5*/}
                  <div className="stepper-item" data-kt-stepper-element="nav">
                    {/* begin::Wrapper*/}
                    <div className="stepper-wrapper">
                      {/* begin::Icon*/}
                      <div className="stepper-icon w-40px h-40px">
                        <i className="stepper-check fas fa-check"></i>
                        <span className="stepper-number">5</span>
                      </div>
                      {/* end::Icon*/}

                      {/* begin::Label*/}
                      <div className="stepper-label">
                        <h3 className="stepper-title">
                          {intl.formatMessage({ id: 'CLAIM.PROOFS_DATAS' })}
                        </h3>
                        <div className="stepper-desc fw-semibold">
                          {intl.formatMessage({
                            id: 'CLAIM.PROOFS_DATAS_DESCRIPTION',
                          })}
                        </div>
                      </div>
                      {/* end::Label*/}
                    </div>
                    {/* end::Wrapper*/}
                  </div>
                  {/* end::Step 5*/}
                </div>
                {/* end::Nav*/}
              </div>
              {/* end::Wrapper*/}
            </div>
            {/* begin::Aside*/}

            <div className="d-flex flex-row-fluid flex-center bg-body rounded">
              <Formik
                validationSchema={currentSchema}
                initialValues={_initialValues}
                onSubmit={submitStep}
              >
                {() => (
                  <Form
                    className="w-100 px-9"
                    noValidate
                    id="kt_create_account_form"
                    placeholder={undefined}
                  >
                    <div className="current" data-kt-stepper-element="content">
                      {/* { stepper?.currentStepIndex == 1 ? <NewClaimStep1InsurranceDatas /> : ''} */}
                      <NewClaimStep1InsurranceDatas
                        isUpdating={true}
                        claimCategoryId={claim?.category_id}
                      />
                    </div>

                    <div data-kt-stepper-element="content">
                      {/* { stepper?.currentStepIndex == 2 ? <NewClaimStep2BasicDatas /> : ''} */}
                      <NewClaimStep2BasicDatas />
                    </div>

                    <div data-kt-stepper-element="content">
                      {
                        <NewClaimStep3AdvancedDatas
                          _updateCustumDatas={updatemoreDatas}
                        />
                      }
                      {/* <NewClaimStep3AdvancedDatas _updateCustumDatas={ updatemoreDatas } /> */}
                    </div>

                    <div data-kt-stepper-element="content">
                      {
                        <NewClaimStep4CustomerDatas
                          isUpdating={true}
                          _customerDatas={customerDatas}
                        />
                      }
                    </div>

                    <div data-kt-stepper-element="content">
                      {
                        <NewClaimStep5ProofsDatas
                          _updateProofsFilesStatus={proofsFilesFilesIsSelected}
                          startProofFilesUploading={startProofFilesUploading}
                          _proofFilesUploadDone={proofFilesUploadDone}
                          existingProofFiles={claimProofs}
                        />
                      }
                    </div>

                    <div className="d-flex flex-stack pt-10">
                      <div className="mr-2">
                        <button
                          onClick={prevStep}
                          type="button"
                          className="btn btn-lg btn-light-primary me-3"
                          data-kt-stepper-action="previous"
                        >
                          <KTIcon iconName="arrow-left" className="fs-4 me-1" />
                          {intl.formatMessage({ id: 'GEN.BACK' })}
                        </button>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="btn btn-lg btn-primary me-3"
                        >
                          {addingClaim ? (
                            <span
                              className="indicator-progress"
                              style={{ display: 'block' }}
                            >
                              {intl.formatMessage({ id: 'GEN.WAIT' })}
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          ) : (
                            <span className="indicator-label">
                              {currentStepIndex === 5 ? (
                                `${intl.formatMessage({ id: 'GEN.SUBMIT' })}`
                              ) : (
                                <>
                                  {intl.formatMessage({ id: 'GEN.NEXT' })}
                                  <KTIcon
                                    iconName="arrow-right"
                                    className="fs-3 ms-2 me-0"
                                  />
                                </>
                              )}

                              {/* {stepper?.currentStepIndex !== ((stepper?.totalStepsNumber || 2) - 1) && 'Continue'}
                                                            {stepper?.currentStepIndex === ((stepper?.totalStepsNumber || 2) - 1) && 'Submit'} */}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { ClaimUpdate };
