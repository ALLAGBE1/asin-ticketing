/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { KTIcon, KTSVG } from '../../../../_metronic/helpers';
import { StepperComponent } from '../../../../_metronic/assets/ts/components';
import { Form, Formik, FormikValues } from 'formik';
import { PageTitle } from '../../../../_metronic/layout/core';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

import { CustomerRequest } from '../../gestion-customer/core/services/CustomerRequests';
import { useNavigate } from 'react-router-dom';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import {
  closeModal,
  handleHttpError,
  toISOString,
} from '../../../utils/functions';
import { CustomerModelCustom } from '../../gestion-customer/core/models/Customer';
import { ClaimRequest } from '../../gestion-reclamation/core/services/ClaimRequest';
import { ClaimModel } from '../../gestion-reclamation/core/models/Claim';
import { NewClaimStep1InsurranceDatas } from '../../gestion-reclamation/components/new-claim-steps/new-claim-step1-InsurranceDatas';
import { NewClaimStep2BasicDatas } from '../../gestion-reclamation/components/new-claim-steps/new-claim-step2-BasicDatas';
import { NewClaimStep3AdvancedDatas } from '../../gestion-reclamation/components/new-claim-steps/new-claim-step3-AdvancedDatas';
import { NewClaimStep4CustomerDatas } from '../../gestion-reclamation/components/new-claim-steps/new-claim-step4-CustomerDatas';
import { NewClaimStep5ProofsDatas } from '../../gestion-reclamation/components/new-claim-steps/new-claim-step5-ProofsDatas';
import { InstitutionRequest } from '../../gestion-paramettres/core/services/InstitutionRequests';
import { InstitutionModel } from '../../gestion-paramettres/core/models/Institution';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';

interface MoreDatas {
  category_id: string;
  isNewUser: string;
  object_id: string;
  customer_type_id: string;
}

const ExternalFormForNewClaim = () => {
  const intl = useIntl();

  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const [institutionId, setinstitutionId] = useState<any>(
    user_datas?.unity?.institution?.id,
  );

  const [claimShema, setClaimShema] = useState([
    Yup.object().shape({
      object_id: Yup.number().required('Objet de reclamation requis'),
    }),

    Yup.object().shape({
      location_event: Yup.string().required("Lieu de l'évènement requis"),
      date_event: Yup.string().required("Date de l'évenement requis"),
      date_claim: Yup.string().required('Date de reclamation requis'),
      description: Yup.string().required('Description requis'),
      product_name: Yup.string(),
      // .required('Produit concerné requis'),
      amount: Yup.number(),
      currency_id: Yup.string(),
      agency_id: Yup.string(),
      expect: Yup.string().required('Attente requis'),
    }),

    Yup.object().shape({
      reception_channel_id: Yup.number().required('Canal de reception requis'),
      response_channel_id: Yup.number().required('Canal de réponse requis'),
      is_reminder: Yup.boolean().required('Rappel requis'),
    }),

    Yup.object().shape({
      // isNewUser: Yup.boolean().required('Choix du client requis'),
      newCustomerLastname: Yup.string(),
      newCustomerFirstname: Yup.string(),
      newCustomerSexe: Yup.string(),
      newCustomerCity: Yup.string(),
      newCustomerPhone: Yup.string(),
      newCustomerEmail: Yup.string().email('Email invalid'),
      account_number: Yup.string(),
      company_name: Yup.string(),
      ifu: Yup.string(),
      location: Yup.string(),
    }),

    Yup.object().shape({
      file: Yup.string(),
    }),
  ]);

  const navigate = useNavigate();

  const customerRequest = new CustomerRequest();
  const claimRequest = new ClaimRequest();
  const institutionRequest = new InstitutionRequest();

  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | any>(null);
  const [currentSchema, setCurrentSchema] = useState<Yup.AnyObject>(
    claimShema[0],
  );
  const [customerDatas, setcustomerDatas] = useState<any>();
  const [customerTypeDatas, setcustomerTypeDatas] = useState<any>('2');
  const [claim, setClaim] = useState(new ClaimModel());

  const [claimProofs, setclaimProofs] = useState(new Array<number>());

  const [addingClaim, setaddingClaim] = useState(false);

  const [isProofsFilesSelected, setisProofsFilesSelected] = useState(false);
  const [startProofFilesUploading, setstartProofFilesUploading] =
    useState(false);
  const [stepsProgression, setStepsProgression] = useState(1);
  const [gettingInstitutions, setgettingInstitutions] = useState(true);

  const [moreDatas, setMoreDatas] = useState<MoreDatas | any>();
  const _initialValues = new ClaimModel();
  const [institutionDatas, setinstitutionDatas] = useState<any>(
    Array<InstitutionModel>,
  );
  const [isInstitutionSelected, setisInstitutionSelected] = useState(false);

  const clamState = [
    {
      name: 'CLAIM.STATE_COMPLETED',
      val: '2',
    },
    {
      name: 'CLAIM.STATE_UNCOMPLETED',
      val: '1',
    },
  ];

  const [claimStatus, setclaimStatus] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goBackToClaimsList = () => {
    navigate('/claims/not-complete');
  };

  const goBackToCompletedClaimsList = () => {
    navigate('/claims/completed');
  };

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement),
    );
  };

  const getInstitutionList = async () => {
    await institutionRequest
      .getInstitutionList()
      .then((response: any) => {
        // console.log(response.data.items)
        setinstitutionDatas(
          response.data.items.filter(
            (e: any) => e.institution_type.libelle != 'HOLDING',
          ),
        );
        setgettingInstitutions(false);
        console.log(institutionDatas);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // to mark if proof files is selected or not
  const proofsFilesFilesIsSelected = (_data: any) => {
    setisProofsFilesSelected(_data);
  };

  // save files proofs to upload
  const saveFileProofToUpload = (_data: any) => {
    setMoreDatas({ ...moreDatas, ..._data });
  };

  // save customer selected datas
  const saveSelectedDatas = (_data: any) => {
    setcustomerDatas(_data);
  };

  // save customer type selected datas
  const saveCustomerTypeDatas = (_data: any) => {
    console.log(_data);
    setcustomerTypeDatas(_data);

    let _customerDatasSchema: any;

    if (_data === '1') {
      _customerDatasSchema = Yup.object().shape({
        customer_id: Yup.number(),
        newCustomerLastname: Yup.string().required('Nom requis'),
        newCustomerFirstname: Yup.string().required('Prénom requis'),
        newCustomerSexe: Yup.string().required('Sexe requis'),
        newCustomerCity: Yup.string().required('Ville requis'),
        newCustomerPhone: Yup.string().required('Téléphone requis'),
        newCustomerEmail: Yup.string()
          .email('Email invalid')
          .required('Email requis'),
        account_number: Yup.string(),
        company_name: Yup.string().required('Nom de la société requis'),
        location: Yup.string().required('Adresse de la société requis'),
        ifu: Yup.string(),
      });
    } else if (_data === '2') {
      _customerDatasSchema = Yup.object().shape({
        customer_id: Yup.number(),
        newCustomerLastname: Yup.string().required('Nom requis'),
        newCustomerFirstname: Yup.string().required('Prénom requis'),
        newCustomerSexe: Yup.string().required('Sexe requis'),
        newCustomerCity: Yup.string().required('Ville requis'),
        newCustomerPhone: Yup.string().required('Téléphone requis'),
        newCustomerEmail: Yup.string()
          .email('Email invalid')
          .required('Email requis'),
        account_number: Yup.string(),
        company_name: Yup.string(),
        location: Yup.string(),
        ifu: Yup.string(),
      });
    }

    // set the schema for the new customer attributes
    setCurrentSchema(_customerDatasSchema);
  };

  // to start proof files uploading
  const startProofFileUpload = () => {
    // tell NewClaimStep5_ProofDatas component that it can start files upload
    setstartProofFilesUploading(true);
  };

  // set uploaded proofs files datas
  const proofFilesUploadDone = (_data: any) => {
    console.log(_data);

    setclaimProofs(_data);

    // setclaimProofs(_data)

    setTimeout(() => {
      addNewClaim(claim, _data);
    }, 1000);
  };

  const prevStep = () => {
    if (!stepper) {
      return;
    }

    stepper.goPrev();

    setCurrentSchema(claimShema[stepper.currentStepIndex - 1]);
  };

  const submitStep = (values: ClaimModel, actions: FormikValues) => {
    if (!stepper) {
      return;
    }

    if (
      stepper.currentStepIndex < stepper.totalStepsNumber &&
      stepper.currentStepIndex != 4
    ) {
      stepper.goNext();
      // setStepsProgression(stepper?.getCurrentStepIndex());
      // setCurrentSchema(claimShema[stepper.currentStepIndex + 1]);
      // currentSchema
    } else if (
      (stepper.currentStepIndex == 4 &&
        moreDatas.isNewUser &&
        moreDatas.customer_id) ||
      (stepper.currentStepIndex == 4 &&
        moreDatas.isNewUser == '1' &&
        currentSchema.isValid)
    ) {
      stepper.goNext();
    } else {
      setClaim(values);
      if (claimStatus) checkRightProcessBeforeClaimSubmition(values);
    }

    setCurrentSchema(claimShema[stepper.currentStepIndex - 1]);
  };

  const cancelSubmit = () => {
    setaddingClaim(false);
    setclaimStatus(null);
  };

  const validClaimStatusAndSubmit = (event: any) => {
    event.preventDefault();
    setaddingClaim(true);
    checkRightProcessBeforeClaimSubmition(claim);
  };

  /**
   * Checks the right process before submitting a claim.
   *
   * @param _data - The data to be processed.
   *
   * If the user is new, it adds a new customer. If the user is not new, it checks if new files are selected and not uploaded.
   * If new files are selected, it starts the proof file upload process. Otherwise, it adds a new claim.
   */
  const checkRightProcessBeforeClaimSubmition = (_data: any) => {
    // if it's a new customer
    if (moreDatas?.isNewUser == '1') {
      addNewCustomer(_data);
    }
    // if not
    else {
      // if new file(s) are selected and not uploaded
      if (isProofsFilesSelected && claimProofs.length == 0) {
        startProofFileUpload();
      } else {
        addNewClaim(_data);
      }
    }
  };

  /**
   * Adds a new claim with the provided claim details and proofs list.
   *
   * @param {object} [val=claim] - The claim details. Defaults to the `claim` object.
   * @param {Array} [proofsList=claimProofs] - The list of proofs associated with the claim. Defaults to the `claimProofs` array.
   * @returns {Promise<void>} A promise that resolves when the claim is successfully added.
   *
   * @throws Will throw an error if the claim addition fails.
   */
  const addNewClaim = async (val = claim, proofsList = claimProofs) => {
    const _claim = {
      ...{
        location_event: val.location_event,
        //@ts-ignore
        date_event: toISOString(val.date_event),
        //@ts-ignore
        date_claim: toISOString(val.date_claim),
        description: val.description,
        expect: val.expect,
        amount: val.amount ?? 0,
        //@ts-ignore
        is_reminder: val.is_reminder == 1 ? true : false,
        customer_id: val.customer_id,
        reception_channel_id: val.reception_channel_id,
        response_channel_id: val.response_channel_id,
        product_name: val.product_name,
        status_id: claimStatus == '1' ? 1 : 2,
        currency_id: val.currency_id ?? '',
        agency_id: val.agency_id ?? '',
        object_id: val.object_id,
      },
      ...moreDatas,
    };

    // console.log(val)

    // console.log(_claim, proofsList);

    //@ts-ignore
    await claimRequest
      //@ts-ignore
      .addClaim(_claim, proofsList)
      .then((response: any) => {
        if (response.status === 200) {
          closeModal();

          // when the claim is uncompleted
          if (claimStatus == '1') {
            goBackToClaimsList();
          }
          // when the claim is completed
          else if (claimStatus == '2') {
            goBackToCompletedClaimsList();
          }
        }
        notificationSuccessToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ADDING.SUCCESS' }),
          5000,
        );
      })
      .catch((error: any) => {
        notificationErrorToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ADDING.ERROR' }),
          5000,
        );
        handleHttpError(error);
      });
  };

  const addNewCustomer = async (val: CustomerModelCustom | any) => {
    console.log(customerTypeDatas);
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
        company_name: val.company_name ?? '',
        ifu: val.ifu ?? '',
        location: val.location ?? '',
      },
      customer_type_id: customerTypeDatas,
    };

    await customerRequest
      .addCustumer(customer)
      .then((response: any) => {
        if (response.status === 200) {
          const _val = {
            ...val,
            ...{ customer_id: response.data.id },
          };
          setClaim(_val);

          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CUSTOMER_NOTIFS.ADDING.SUCCESS' }),
            5000,
          );

          if (isProofsFilesSelected) {
            startProofFileUpload();
          } else {
            addNewClaim(_val);
            setClaim(_val);
          }
        }
      })
      .catch((error: any) => {
        notificationErrorToast(
          intl.formatMessage({ id: 'NOTIFS.CUSTOMER_NOTIFS.ADDING.ERROR' }),
          5000,
        );
        handleHttpError(error);
      });
  };

  const updateCustomerSchema = (newType: string) => {
    let _customerDatasSchema: any;

    // when is new customer selected
    if (newType === '1') {
      _customerDatasSchema = Yup.object().shape({
        customer_id: Yup.number(),
        newCustomerLastname: Yup.string().required('Nom requis'),
        newCustomerFirstname: Yup.string().required('Prénom requis'),
        newCustomerSexe: Yup.string().required('Sexe requis'),
        newCustomerCity: Yup.string().required('Ville requis'),
        newCustomerPhone: Yup.string().required('Téléphone requis'),
        newCustomerEmail: Yup.string()
          .email('Email invalid')
          .required('Email requis'),
        account_number: Yup.string(),
        company_name: Yup.string(),
        location: Yup.string(),
        ifu: Yup.string(),
      });
    }
    // when is old customer selected
    else if (newType === '2') {
      _customerDatasSchema = Yup.object().shape({});
    }

    // set the schema for the new customer attributes
    setCurrentSchema(_customerDatasSchema);
    console.log(_customerDatasSchema);
  };

  const updatemoreDatas = (_data: any) => {
    console.log({ ...moreDatas, ..._data });
    setMoreDatas({ ...moreDatas, ..._data });
  };

  const validInstitutionChoice = () => {
    setisInstitutionSelected(true);
  };

  useEffect(() => {
    getInstitutionList();

    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);

  return (
    <>
      {isInstitutionSelected ? (
        <>
          {/* valid if the claim is complet or not modal */}
          <div className="modal fade" tabIndex={-1} id="kt_modal_1">
            <div className="modal-dialog">
              <form
                className="form w-100"
                onSubmit={validClaimStatusAndSubmit}
                noValidate
                id="kt_login_signin_form"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {intl.formatMessage({ id: 'CLAIM.CLAIM_STATUT_CHOOSE' })}
                    </h5>
                    <div
                      className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                      data-bs-dismiss="modal"
                      id="modal_close"
                      aria-label="Close"
                      onClick={() => setaddingClaim(false)}
                    >
                      <KTSVG
                        path="media/icons/duotune/arrows/arr061.svg"
                        className="svg-icon svg-icon-2x"
                      />
                    </div>
                  </div>

                  <div className="modal-body">
                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'CLAIM.CHOOSE_STATE' })}
                      </label>

                      <select
                        className="form-control bg-transparent"
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        onChange={(el: any) => setclaimStatus(el.target.value)}
                      >
                        <option>
                          {intl.formatMessage({
                            id: 'CLAIM.CHOOSE_CLAIM_STATUS',
                          })}
                        </option>

                        {clamState?.map((row, index) => (
                          <option key={index} value={row.val}>
                            {intl.formatMessage({ id: row.name })}
                          </option>
                        ))}
                      </select>

                      {!claimStatus && (
                        <div className="fv-plugins-message-container text-danger">
                          <span role="alert text-danger">Statut required</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                      onClick={() => cancelSubmit()}
                    >
                      {intl.formatMessage({ id: 'GEN.CANCEL' })}
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={(e: any) => validClaimStatusAndSubmit(e)}
                      disabled={!claimStatus}
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
                          {intl.formatMessage({ id: 'GEN.VALID' })}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* <PageTitle breadcrumbs={[]}>
            {intl.formatMessage({ id: 'CLAIM.ADD' })}
          </PageTitle> */}

          <div
            ref={stepperRef}
            className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
            id="kt_create_account_stepper"
          >
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
                            id: 'CLAIM.CUSTOMER_DATAS_DESCRIPTION',
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

            <div className="d-flex flex-row-fluid flex-center bg-body rounded py-10">
              <Formik
                validationSchema={currentSchema}
                initialValues={_initialValues}
                onSubmit={submitStep}
                // initialTouched={
                //   {
                //     customer_id: true,
                //     newCustomerLastname:true,
                //     newCustomerFirstname: true,
                //     newCustomerSexe: true,
                //     newCustomerCity: true,
                //     newCustomerPhone: true,
                //     newCustomerEmail: true,
                //     account_number: true,
                //     company_name: true,
                //     location: true,
                //     ifu: true,
                //   }
                // }
              >
                {({ setFieldTouched, validateForm, errors, touched }) => (
                  <Form
                    className="w-100 px-9"
                    noValidate
                    id="kt_create_account_form"
                    placeholder={undefined}
                  >
                    <div className="current" data-kt-stepper-element="content">
                      {stepper?.currentStepIndex == 1 && (
                        <NewClaimStep1InsurranceDatas />
                      )}
                    </div>

                    <div data-kt-stepper-element="content">
                      {stepper?.currentStepIndex == 2 && (
                        <NewClaimStep2BasicDatas />
                      )}
                    </div>

                    <div data-kt-stepper-element="content">
                      {stepper?.currentStepIndex == 3 && (
                        <NewClaimStep3AdvancedDatas
                          _updateCustumDatas={updatemoreDatas}
                        />
                      )}
                    </div>

                    <div data-kt-stepper-element="content">
                      {stepper?.currentStepIndex == 4 && (
                        <NewClaimStep4CustomerDatas
                          newDatasSendForCustumSchema={updateCustomerSchema}
                          _updateCustumDatas={updatemoreDatas}
                          _saveCustomerDatas={saveSelectedDatas}
                          savedSelectedCustomerDatas={customerDatas}
                          _saveCustomerTypeDatas={saveCustomerTypeDatas}
                          savedCustomerTypeDatas={customerTypeDatas}
                          isNewUser={moreDatas?.isNewUser}
                          formsErrorsDatas={errors}
                          formsTouchedDatas={touched}
                        />
                      )}
                    </div>

                    <div data-kt-stepper-element="content">
                      {stepper?.currentStepIndex == 5 && (
                        <NewClaimStep5ProofsDatas
                          _updateProofsFilesStatus={proofsFilesFilesIsSelected}
                          _saveFileToUpload={saveFileProofToUpload}
                          savedFilesToUpload={
                            moreDatas?.proofsFilesToUploadList
                          }
                          startProofFilesUploading={startProofFilesUploading}
                          _proofFilesUploadDone={proofFilesUploadDone}
                          existingProofFiles={claimProofs}
                        />
                      )}
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
                        {addingClaim ? (
                          <button
                            className="btn btn-lg btn-primary me-3"
                            type="submit"
                          >
                            <span
                              className="indicator-progress"
                              style={{ display: 'block' }}
                            >
                              {intl.formatMessage({ id: 'GEN.WAIT' })}
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          </button>
                        ) : (
                          <>
                            {stepper?.currentStepIndex == 5 ? (
                              <>
                                <button
                                  className="btn btn-lg btn-primary me-3"
                                  type="submit"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_1"
                                >
                                  <span className="indicator-label">
                                    {intl.formatMessage({ id: 'GEN.SUBMIT' })}
                                    <KTIcon
                                      iconName="arrow-right"
                                      className="fs-3 ms-2 me-0"
                                    />
                                  </span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-lg btn-primary me-3"
                                  type="submit"
                                >
                                  <span className="indicator-label">
                                    {intl.formatMessage({ id: 'GEN.NEXT' })}
                                    <KTIcon
                                      iconName="arrow-right"
                                      className="fs-3 ms-2 me-0"
                                    />
                                  </span>
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" flex-column flex-xl-row flex-row-fluid">
            <div className="card justify-content-center justify-content-xl-start h-300px flex-row-auto w-500px me-9">
              <h3 className="text-center mt-18">
                Choisir l'institution concerné
              </h3>

              <div className="row mt-5">
                <div className="col-8 mx-auto">
                  <div className="fv-row mb-8">
                    <label className="form-label mb-3 required">
                      {intl.formatMessage({
                        id: 'SETTINGS.INSTITUTION',
                      })}
                    </label>

                    {gettingInstitutions ? (
                      <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                    ) : (
                      <>
                        <select
                          onChange={(event: any) =>
                            setinstitutionId(event?.target.value)
                          }
                          className="form-control bg-transparent"
                          data-control="select2"
                          data-placeholder="Latest"
                          data-hide-search="true"
                        >
                          <option>
                            {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                              intl.formatMessage({
                                id: 'SETTINGS.INSTITUTION',
                              })}
                          </option>

                          {institutionDatas?.map((row: any, index: number) => (
                            <option key={index} value={row.id}>
                              {row.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex mt-3">
                <button
                  disabled={!institutionId}
                  onClick={() => validInstitutionChoice()}
                  className="btn btn-lg btn-primary col-3 mx-auto"
                  type="submit"
                >
                  <span className="indicator-label">Valider</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export { ExternalFormForNewClaim };
