/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';

import { ClaimModel } from '../core/models/Claim';
import { ClaimRequest } from '../core/services/ClaimRequest';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  capitalizeStr,
  checkIfStatusIsVerified,
  closeModal,
  handleHttpError,
} from '../../../utils/functions';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { ResponseChannelRequest } from '../../gestion-paramettres/core/services/ResponseChannelRequests';
import { StatusRequest } from '../../gestion-paramettres/core/services/StatusRequests';
import { ResponseChannelModel } from '../../gestion-paramettres/core/models/ResponseChannel';
import { StatusModel } from '../../gestion-paramettres/core/models/Status';
import { DetailsStep1AssuranceDatas } from '../components/details-steps/details-step1-assuranceDatas';
import { DetailsStep2BasicDatas } from '../components/details-steps/details-step2-basicDatas';
import { DetailsStep3AdvencedDatas } from '../components/details-steps/details-step3-advencedDatas';
import { DetailsStep4CustomerDatas } from '../components/details-steps/details-step4-customerDatas';
import { DetailsStep5ProofsDatas } from '../components/details-steps/details-step5-proofsDatas';
import { ComplaintObjectRequest } from '../../gestion-paramettres/core/services/ComplaintsObjectRequest';
import { ComplaintObjectModel } from '../../gestion-paramettres/core/models/ComplaintObject';
import clsx from 'clsx';
import { UnityRequest } from '../../gestion-paramettres/core/services/UnityRequests';
import { UnityModel } from '../../gestion-paramettres/core/models/Unity';
import { ClaimProcessRequests } from '../core/services/ClaimProcessRequests';
import { ClaimProcessModel } from '../core/models/ClaimProcess';
import { ClaimFoundedRequests } from '../core/services/ClaimFoundedRequests';
import { ComplaintCategoryRequest } from '../../gestion-paramettres/core/services/ComplaintsCategoryRequest';
import { ComplaintCategoryModel } from '../../gestion-paramettres/core/models/ComplaintCategory';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { ClaimSatisfactionFormRequests } from '../core/services/ClaimSatisfactionFormRequests';
import { LevelRequests } from '../../gestion-paramettres/core/services/LevelRequests';
import { LevelModel } from '../../gestion-paramettres/core/models/Level';
import { UserAccountRequest } from '../../gestion-utilisateurs/core/services/userAccountRequest';
import { UserModel } from '../../auth';
import { ClaimSatisfactionModel } from '../core/models/ClaimSatisfaction';

const claimRequest = new ClaimRequest();
const claimProcessRequest = new ClaimProcessRequests();
const complaintCategoryRequest = new ComplaintCategoryRequest();
const complaintObjectRequest = new ComplaintObjectRequest();
const statusRequest = new StatusRequest();
const unityRequest = new UnityRequest();
const usersRequest = new UserAccountRequest();

const claimFoundedRequests = new ClaimFoundedRequests();
const claimSatifactionFormRequests = new ClaimSatisfactionFormRequests();
const levelRequests = new LevelRequests();

const _USER_DATA_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;
//@ts-ignore
const _userDatas = JSON.parse(localStorage.getItem(_USER_DATA_KEY));

const claimAssignSchema = Yup.object().shape({
  // claim_id: Yup.number()
  //   .required('Claim is required'),
  unity_id: Yup.number().required('Unity is required'),
  // user_id: Yup.number(),
  // process_id: Yup.number(),
  // founded_id: Yup.number()
});

const claimQuilifySchema = Yup.object().shape({
  object_id: Yup.number(),
});

const claimProcessSchemaForTreatment = Yup.object().shape({
  amount: Yup.string(),
  preventive_action: Yup.string().required('L\'action préventive Solution est requis'),
  solution: Yup.string().required('Solution est requis'),
  comment: Yup.string(),
});

const claimProcessSchemaForValidation = Yup.object().shape({
  amount: Yup.number(),
  preventive_action: Yup.string().required('L\'action préventive Solution est requis'),
  solution: Yup.string().required('Solution est requis'),
  comment: Yup.string(),
  message_to_send: Yup.string().required('Message est requis'),
});

const claimFoundedSchema = Yup.object().shape({
  motif: Yup.string().required('Motif is required'),
  solution: Yup.string().required('Solution is required'),
  is_founded: Yup.number().required('this question is required'),
  // assign_id: Yup.number()
});

const claimSatisfaiingSchema = Yup.object().shape({
  comment: Yup.string(),
  level_id: Yup.number().required('Level is required'),
  isSatisfied: Yup.number().required('this question is required'),
});

const claimSAssigningToAnotherUserSchema = Yup.object().shape({
  user_id: Yup.string().required('User is required'),
});

let toUpdateValue = {
  object_id: '',
};

const toAssignValue = {
  unity_id: 0,
  user_id: 0,
};

const toAssignToAnotherUserValue = {
  user_id: 0,
};

const toTreatValue = {
  amount: '',
  preventive_action: '',
  solution: '',
  comment: '',
};

const toFoundValue = {
  motif: null,
  solution: '',
  is_founded: 1,
};

const toSatisfaingValue = {
  level_id: null,
  comment: '',
  isSatisfied: null,
};

const ClaimDetails: FC = (props) => {
  const intl = useIntl();

  const claimId: any = useParams()['claim_id'];

  const navigate = useNavigate();

  const [toDeleteValue, settoDeleteValue] = useState(new ClaimModel());

  const [loading, setLoading] = useState(false);

  const [claimloader, setclaimloader] = useState(true);
  const [claimDeleteloader, setclaimDeleteloader] = useState(false);
  // const [qualifyClaim, setqualifyClaim] = useState(false);
  const [qualifyClaimLoader, setqualifyClaimLoader] = useState(false);
  const [qualifyAssignLoader, setqualifyAssignLoader] = useState(false);
  const [processClaimLoader, setprocessClaimLoader] = useState(false);
  const [foundClaimLoader, setfoundClaimLoader] = useState(false);
  const [satisfaiingClaimLoader, setsatisfaiingClaimLoader] = useState(false);
  const [gettingProcessDatasLoader, setgettingProcessDatasLoader] =
    useState(false);
  const [gettingSatisfactionDatasLoader, setgettingSatisfactionDatasLoader] =
      useState(false);
  const [gettingLevelLoader, setgettingLevelLoader] = useState(false);
  const [complaintObjectLoader, setcomplaintObjectLoader] = useState(0);
  const [sendingNotificationLoader, setsendingNotificationLoader] = useState(0);

  const [chooseWhoToAssignTheClaim, setchooseWhoToAssignTheClaim] = useState(0); // 0: not choosed; 1:Unity choosed; 2:another agent choosed; 3:Myself choosed

  const [claim, setClaim] = useState<ClaimModel | any>();
  const [claimProcess, setclaimProcess] = useState<ClaimProcessModel | any>();
  const [claimSatisfaction, setclaimSatisfaction] = useState<ClaimSatisfactionModel | any>();

  const [errorMsg, setErrorMsg] = useState('');
  const [isFounded, setIsFounded] = useState<boolean>();
  const [claimHasBeenFounded, setclaimHasBeenFounded] = useState<number>(); // undefined: fetching data; 1:Claim founded; 0:claim not founded

  const [unitiesDatas, setunitiesDatas] = useState(Array<UnityModel>);
  const [usersDatas, setusersDatas] = useState(Array<any>);
  const [gettingUnitiesDatasLoader, setgettingUnitiesDatasLoader] =
    useState(false);
  const [gettingUsersDatasByUnityLoader, setgettingUsersDatasByUnityLoader] =
    useState(0); // 0: not loaded; 1: data loading; 2: data loaded

  const [complaintObjectDatas, setcomplaintObjectDatas] = useState(
    Array<ComplaintObjectModel>,
  );
  const [levelDatas, setlevelDatas] = useState(Array<LevelModel>);
  const [complaintCategoryDatas, setcomplaintCategoryDatas] = useState(
    Array<ComplaintCategoryModel>,
  );

  const foundedVal = [
    {
      name: 'GEN.NO',
      val: 0,
    },
    {
      name: 'GEN.YES',
      val: 1,
    },
  ];

  const goToCompleteClaim = () => {
    navigate('/claims/update/' + claim?.id);
  };

  const goToAssignClaims = () => {
    navigate('/claims/to-assign');
  };

  const goToTreatClaims = () => {
    navigate('/claims/to-treat');
  };

  const goToValidClaims = () => {
    navigate('/claims/to-valid');
  };

  const goToNotifyClaims = () => {
    navigate('/claims/to-notify');
  };

  const goToCloseClaims = () => {
    navigate('/claims/to-close');
  };

  const goToClosedClaims = () => {
    navigate('/claims/closed');
  };

  const goToMesuredClaims = () => {
    navigate('/claims/measured');
  };

  const goToNotFoundedClaims = () => {
    navigate('/claims/not-founded');
  };

  const selectToDelete = (data: ClaimModel | any) => {
    settoDeleteValue(data);
  };

  const chooseFoundedValue = ($event: any) => {
    if (
      $event?.type &&
      $event.type === 'change' &&
      $event.target.name === 'is_founded'
    ) {
      console.log($event.target.value);
      setIsFounded($event.target.value);
    }
  };

  const formkikQualify = useFormik({
    initialValues: toUpdateValue,
    validationSchema: claimQuilifySchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setqualifyClaimLoader(true);
      console.log(values);

      const _claim = {
        ...claim,
        ...{ object_id: values?.object_id ? values?.object_id : claim.object.id },
      };

      console.log(_claim);

      await claimRequest
        .qualifyClaim(_claim)
        .then((response: any) => {
          closeModal('modal_close-formkikQualify');
          goToAssignClaims();
          setqualifyClaimLoader(false);
          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.QUALIFY.SUCCESS' }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          setqualifyClaimLoader(false);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.QUALIFY.ERROR' }),
            5000,
          );
          handleHttpError(error);
        });
    },
  });

  const formkikAssign = useFormik({
    initialValues: toAssignValue,
    validationSchema: claimAssignSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      console.log(values);

      if (values?.unity_id) {
        setqualifyClaimLoader(true);

        //@ts-ignore
        await claimRequest.assignClaimToUnity(claim.id, parseInt(values?.unity_id))
          .then((response: any) => {
            // if(response.status === 200) {
            //   console.log(response);
            //   closeModal()
            //   goToTreatClaims();
            // }
            closeModal('modal_close-formkikAssign');
            goToTreatClaims();
            setStatus(false);
            setSubmitting(false);
            notificationSuccessToast(
              intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.SUCCESS' }),
              5000,
            );
          })
          .catch((error: any) => {
            console.log(error);
            setStatus(false);
            setSubmitting(false);
            setqualifyClaimLoader(false);
            notificationErrorToast(
              intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.ERROR' }),
              5000,
            );
            handleHttpError(error);
          });
      }
    },
  });

  const formkikAssignToAnotherUser = useFormik({
    initialValues: toAssignToAnotherUserValue,
    validationSchema: claimSAssigningToAnotherUserSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      console.log(values);
      setqualifyAssignLoader(true);

      //@ts-ignore
      await claimRequest.assignClaimToUser(claim.id, parseInt(values?.user_id))
        .then((response: any) => {
          closeModal('modal_close-formkikAssignToAnotherUser');
          goToTreatClaims();
          setStatus(false);
          setSubmitting(false);
          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.SUCCESS' }),
            5000,
          );
        })
        .catch((error: any) => {
          console.log(error);
          setStatus(false);
          setSubmitting(false);
          setqualifyAssignLoader(false);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.ERROR' }),
            5000,
          );
          handleHttpError(error);
        });
    },
  });

  const assignClaimToMySelf = async () => {
    setqualifyClaimLoader(false);
    //@ts-ignore
    const user_datas = JSON.parse(localStorage.getItem(_USER_DATA_KEY));

    console.log(claim.id, user_datas.id);

    await claimRequest
      .assignClaimToUser(claim.id, user_datas.id)
      .then((response: any) => {
        closeModal('modal_close-formkikAssign');
        goToTreatClaims();
        notificationSuccessToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.SUCCESS' }),
          5000,
        );
      })
      .catch((error: any) => {
        setqualifyClaimLoader(false);
        notificationErrorToast(
          intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.ASSIGN.ERROR' }),
          5000,
        );
        handleHttpError(error);
      });
  };

  const formkikFounded = useFormik({
    initialValues: toFoundValue,
    validationSchema: claimFoundedSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setfoundClaimLoader(true);
      console.log(values);

      const founded_datas = {
        ...values,
        ...{ is_founded: Number(values.is_founded) === 1 ? true : false },
      };

      // console.log(founded_datas);

      //@ts-ignore
      await claimFoundedRequests.addClaimFound(founded_datas, claim.id)
        .then((response: any) => {
          closeModal('modal_close-formkikFounded');
          setStatus(false);
          setSubmitting(false);
          goToAssignClaims();
          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.FOUNDED.SUCCESS' }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.FOUNDED.ERROR' }),
            5000,
          );
        });
    },
  });

  const formkikTreat = useFormik({
    initialValues: toTreatValue,
    validationSchema: claimProcessSchemaForTreatment,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setprocessClaimLoader(true);

      // console.log(values);

      const treatment_datas = {
        ...values,
        ...{ claim_id: claim.id },
      };

      console.log(treatment_datas);

      await claimProcessRequest
        .addClaimProcess({...values, ...{amount: new Number(values.amount)}}, claim.id)
        .then((response: any) => {
          closeModal('modal_close-formkikTreat');
          setStatus(false);
          setSubmitting(false);
          goToValidClaims();
          notificationSuccessToast(
            intl.formatMessage({
              id: 'NOTIFS.CLAIMS_NOTIFS.TREATMENT.SUCCESS',
            }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          setprocessClaimLoader(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.TREATMENT.ERROR' }),
            5000,
          );
        });
    },
  });

  const formkikValidate = useFormik({
    initialValues: claimProcess,
    validationSchema: claimProcessSchemaForValidation,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setprocessClaimLoader(true);

      const treatment_datas = {
        ...values,
        ...{ claim_id: claim.id },
      };

      console.log(treatment_datas);

      await claimProcessRequest
        .validateProcess({...values, ...{amount: new Number(values.amount)}}, claim.id)
        .then((response: any) => {
          closeModal('modal_close-formkikValidate');
          setStatus(false);
          setSubmitting(false);
          goToValidClaims();
          notificationSuccessToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.VALIDATE.SUCCESS' }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          setprocessClaimLoader(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.VALIDATE.ERROR' }),
            5000,
          );
        });
    },
  });

  const sendNotificationToTheClientAboutHisComplaint = async () => {
    setsendingNotificationLoader(1);

    await claimProcessRequest
      .notifyProcessToClient(claim.id)
      .then((response: any) => {
        console.log(response.data);
        goToNotifyClaims();
        closeModal('modal_close-sendNotificationToTheClientAboutHisComplaint');
        notificationSuccessToast(
          intl.formatMessage({ id: 'CLAIMS.NOTIFY.SENDED_SUCCESFULLY' }),
        );
      })
      .catch((error: any) => {
        setsendingNotificationLoader(2);
        handleHttpError(error);
      });
  };

  const formkikSatisfaiing = useFormik({
    initialValues: toSatisfaingValue,
    validationSchema: claimSatisfaiingSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setsatisfaiingClaimLoader(true);

      const satisfaction_datas = {
        ...values,
        ...{ isSatisfied: values.isSatisfied ? true : false },
        ...{ process_id: claimProcess.claim.id },
      };

      console.log(satisfaction_datas);

      // @ts-ignore
      await claimSatifactionFormRequests.addClaimSatisfactionForm(satisfaction_datas, claim.id, values.level_id)
        .then((response: any) => {
          closeModal('modal_close-formkikSatisfaiing');
          setStatus(false);
          setSubmitting(false);
          goToMesuredClaims();
          setsatisfaiingClaimLoader(false);
          notificationSuccessToast(
            intl.formatMessage({
              id: 'NOTIFS.CLAIMS_NOTIFS.SATISFAING.SUCCESS',
            }),
            5000,
          );
        })
        .catch((error: any) => {
          setStatus(false);
          setSubmitting(false);
          setsatisfaiingClaimLoader(false);
          handleHttpError(error);
          notificationErrorToast(
            intl.formatMessage({ id: 'NOTIFS.CLAIMS_NOTIFS.SATISFAING.ERROR' }),
            5000,
          );
        });
    },
  });

  const getClaimById = async (claimId: number) => {
    setclaimloader(true);

    await claimRequest
      .getClaimById(claimId)
      .then((response: any) => {
        // console.log(response)
        setClaim(response.data);
        setclaimloader(false);

        toUpdateValue = {
          object_id: claim?.object.id,
        };

        if (
          response.data.status.libelle == 'QUALIFY' ||
          response.data.status.libelle == 'IN_PROCESS' ||
          response.data.status.libelle == 'PROCESSED' ||
          response.data.status.libelle == 'VALIDATE' ||
          response.data.status.libelle == 'NOTIFY' ||
          response.data.status.libelle == 'CLOSED'
        ) {
          getUnitiesList();
          getFoundDataByClaimId(response.data.id);
        }

        if (
          response.data.status.libelle == 'NOTIFY' ||
          response.data.status.libelle == 'VALIDATE' ||
          response.data.status.libelle == 'PROCESSED' ||
          response.data.status.libelle == 'CLOSED'
        ) {
          getSatisfactionByClaimId(response.data.id);
          getProcessByClaimId(response.data.id);
          setgettingProcessDatasLoader(true);
          getLevelList();
        }
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getFoundDataByClaimId = async (claimId: number) => {
    await claimFoundedRequests
      .getClaimFoundByClaimId(claimId)
      .then((response: any) => {
        if (response.data.id) {
          console.log(response.data)
          setclaimHasBeenFounded(1);
        } else {
          setclaimHasBeenFounded(0);
        }
      })
      .catch((error: any) => {
        // handleHttpError(error)
        setclaimHasBeenFounded(0);
      });
  };

  const getProcessByClaimId = async (claimId: number) => {
    await claimProcessRequest
      .getClaimProcessByClaimId(claimId)
      .then((response: any) => {
        console.log(response.data)
        setclaimProcess(response.data);
        setgettingProcessDatasLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getSatisfactionByClaimId = async (claimId: number) => {
    await claimSatifactionFormRequests
      .getClaimSatisfactionFormById(claimId)
      .then((response: any) => {
        console.log(response.data)
        setclaimSatisfaction(response.data);
        setgettingSatisfactionDatasLoader(false);
      })
      .catch((error: any) => {
        // handleHttpError(error);
      });
  };

  const getComplaintObjectList = async () => {
    await complaintObjectRequest
      .getComplaintObjectList()
      .then((response: any) => {
        setcomplaintObjectDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getLevelList = async () => {
    setgettingLevelLoader(true);

    await levelRequests
      .getLevelList()
      .then((response: any) => {
        setlevelDatas(response.data.items);
        setgettingLevelLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintCategoryList = async () => {
    await complaintCategoryRequest
      .getComplaintCategoriesList()
      .then((response: any) => {
        setcomplaintCategoryDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUnitiesList = async () => {
    setgettingUnitiesDatasLoader(true);

    // getUnityListByInstitutionId(_userDatas.unity.institution.id)
    await unityRequest
      .getUnityListByInstitutionId(_userDatas.unity.institution.id)
      .then((response: any) => {
        setunitiesDatas(response.data);
        setgettingUnitiesDatasLoader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUsersListByUnityId = async (unity_id: string) => {
    setgettingUsersDatasByUnityLoader(1);

    await usersRequest
      .getUsersDatasByUnityId(unity_id)
      .then((response: any) => {
        console.log(response.data);
        setusersDatas(response.data.items);
        setgettingUsersDatasByUnityLoader(2);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const chooseCategory = async (event: any) => {
    console.log(event.target.value);

    setcomplaintObjectLoader(1);

    const categoryId = event.target.value;

    await complaintObjectRequest
      .getComplaintObjectListByCategpriId(categoryId)
      .then((response: any) => {
        console.log(response.data);
        setcomplaintObjectDatas(response.data);
        setcomplaintObjectLoader(2);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const chooseWhichOneToAssignTheClaim = (value: number) => {
    setchooseWhoToAssignTheClaim(value);

    if (value == 1) {
      formkikAssign.submitForm();
    } else if (value == 2) {
      closeModal('modal_close-formkikAssign');
    } else if (value == 3) {
      assignClaimToMySelf();
    }
  };

  useEffect(() => {
    getClaimById(claimId);
    getComplaintCategoryList();
  }, []);

  return (
    <>
      {/* qualify claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formkikQualify.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikQualify"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.CLAIM_QUALIFICATION' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikQualify"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                <h4 className="text-center" style={{ marginBottom: '3rem' }}>
                  {intl.formatMessage({ id: 'CLAIM.ACTUAL_CLAIM_IS' })} :{' '}
                  <strong className="text-danger">
                    {claim?.object.libelle}
                  </strong>{' '}
                </h4>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
                  </label>

                  <select
                    className={clsx('form-control bg-transparent')}
                    onChange={() => chooseCategory(event)}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                  >
                    <option>
                      Veuillez selectionner la categorie de la qualification
                    </option>

                    {complaintCategoryDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'CLAIM.NEW_CLAIM_OBJECT' })}
                  </label>

                  {complaintObjectLoader == 1 && (
                    <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                  )}

                  {complaintObjectLoader == 2 && (
                    <>
                      <select
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikQualify.touched.object_id &&
                              formkikQualify.errors.object_id,
                          },
                          {
                            'is-valid':
                              formkikQualify.touched.object_id &&
                              !formkikQualify.errors.object_id,
                          },
                        )}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formkikQualify.getFieldProps('object_id')}
                      >
                        <option>
                          Veuillez selectionner l'objet de qualification
                        </option>

                        {complaintObjectDatas?.map((row, index) => (
                          <option key={index} value={row.id}>
                            {row.libelle}
                          </option>
                        ))}
                      </select>

                      {formkikQualify.touched.object_id &&
                        formkikQualify.errors.object_id && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">
                              {formkikQualify.errors.object_id}
                            </span>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => setqualifyClaimLoader(false)}
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formkikQualify.isSubmitting || !formkikQualify.isValid
                  }
                >
                  {!qualifyClaimLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'CLAIM.QUALIFY' })}
                    </span>
                  )}
                  {qualifyClaimLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* treat/process claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-900"
            onSubmit={formkikTreat.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikTreat"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIMS.TREATMENT' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikTreat"
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
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
                  </label>

                  <input
                    placeholder={intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
                    {...formkikTreat.getFieldProps('amount')}
                    className={clsx(
                      'form-control bg-transparent'
                    )}
                    type="number"
                    name="amount"
                    autoComplete="on"
                  />
                  {/* {formkikTreat.touched.amount &&
                    formkikTreat.errors.amount && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formkikTreat.errors.amount}</span>
                      </div>
                    )} */}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required required">
                    {intl.formatMessage({ id: 'GEN.SOLUTION' })}
                  </label>

                  <textarea
                    id=""
                    cols={30}
                    rows={3}
                    placeholder={intl.formatMessage({ id: 'GEN.SOLUTION' })}
                    {...formkikTreat.getFieldProps('solution')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formkikTreat.touched.solution &&
                          formkikTreat.errors.solution,
                      },
                      {
                        'is-valid':
                          formkikTreat.touched.solution &&
                          !formkikTreat.errors.solution,
                      },
                    )}
                  ></textarea>

                  {formkikTreat.touched.solution &&
                    formkikTreat.errors.solution && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formkikTreat.errors.solution}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required required">
                    {intl.formatMessage({ id: 'GEN.PREVENTION_ACTION' })}
                  </label>

                  <textarea
                    id=""
                    cols={30}
                    rows={3}
                    placeholder={intl.formatMessage({
                      id: 'GEN.PREVENTION_ACTION',
                    })}
                    {...formkikTreat.getFieldProps('preventive_action')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formkikTreat.touched.preventive_action &&
                          formkikTreat.errors.preventive_action,
                      },
                      {
                        'is-valid':
                          formkikTreat.touched.preventive_action &&
                          !formkikTreat.errors.preventive_action,
                      },
                    )}
                  ></textarea>

                  {formkikTreat.touched.preventive_action &&
                    formkikTreat.errors.preventive_action && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formkikTreat.errors.preventive_action}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'GEN.COMMENT' })}
                  </label>

                  <textarea
                    id=""
                    cols={30}
                    rows={3}
                    placeholder={intl.formatMessage({ id: 'GEN.COMMENT' })}
                    {...formkikTreat.getFieldProps('comment')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formkikTreat.touched.comment &&
                          formkikTreat.errors.comment,
                      },
                      {
                        'is-valid':
                          formkikTreat.touched.comment &&
                          !formkikTreat.errors.comment,
                      },
                    )}
                  ></textarea>

                  {formkikTreat.touched.comment &&
                    formkikTreat.errors.comment && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formkikTreat.errors.comment}</span>
                      </div>
                    )}
                </div>

                <h3 className="col-12 text-danger text-center">
                  {errorMsg ? errorMsg : ''}
                </h3>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formkikTreat.isSubmitting || !formkikTreat.isValid}
                >
                  {!processClaimLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.TREAT' })}
                    </span>
                  )}
                  {processClaimLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* assign claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formkikAssign.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikAssign"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.CLAIM_ASSIGNMENT' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikAssign"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                {chooseWhoToAssignTheClaim == 0 && (
                  <div className="fv-row d-flex row">
                    <div className="col-9 mb-2" style={{ margin: '0 auto' }}>
                      <button
                        type="button"
                        onClick={() => chooseWhichOneToAssignTheClaim(1)}
                        className="btn btn-white btn-outline btn-outline-solid width-100 btn-active-primary"
                      >
                        {intl.formatMessage({ id: 'CLAIM.ASSIGN_TO_UNITY' })}
                      </button>
                    </div>

                    <div className="col-9 mb-2" style={{ margin: '0 auto' }}>
                      <button
                        type="button"
                        // disabled={true}
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_3P"
                        onClick={() => chooseWhichOneToAssignTheClaim(2)}
                        className="btn btn-white btn-outline btn-outline-solid width-100 btn-active-primary"
                      >
                        {intl.formatMessage({ id: 'CLAIM.ASSIGN_TO_AGENT' })}
                      </button>
                    </div>
                  </div>
                )}

                {(chooseWhoToAssignTheClaim == 0 ||
                  chooseWhoToAssignTheClaim == 3) && (
                  <div className="fv-row d-flex row">
                    <div className="col-9 mb-2" style={{ margin: '0 auto' }}>
                      <button
                        type="button"
                        onClick={() => chooseWhichOneToAssignTheClaim(3)}
                        className="btn btn-white btn-outline btn-outline-solid width-100 btn-active-primary"
                      >
                        {chooseWhoToAssignTheClaim == 0 &&
                          intl.formatMessage({ id: 'CLAIM.ASSIGN_TO_MYSELF' })}
                        {chooseWhoToAssignTheClaim == 3 &&
                          intl.formatMessage({ id: 'GEN.WAIT' })}
                      </button>
                    </div>
                  </div>
                )}

                {chooseWhoToAssignTheClaim == 1 && (
                  <div className="fv-row mb-8">
                    <label className="form-label fs-6 fw-bolder text-gray-900 required">
                      {intl.formatMessage({ id: 'SETTINGS.UNITY' })}
                    </label>

                    {gettingUnitiesDatasLoader && (
                      <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                    )}

                    {!gettingUnitiesDatasLoader && (
                      <>
                        <select
                          className={clsx(
                            'form-control bg-transparent',
                            {
                              'is-invalid':
                                formkikAssign.touched.unity_id &&
                                formkikAssign.errors.unity_id,
                            },
                            {
                              'is-valid':
                                formkikAssign.touched.unity_id &&
                                !formkikAssign.errors.unity_id,
                            },
                          )}
                          data-control="select2"
                          data-placeholder="Latest"
                          data-hide-search="true"
                          {...formkikAssign.getFieldProps('unity_id')}
                        >
                          <option>Veuillez selectionner l'unité</option>

                          {unitiesDatas?.map((row, index) => (
                            <option key={index} value={row.id}>
                              {row.libelle}
                            </option>
                          ))}
                        </select>

                        {formkikAssign.touched.unity_id &&
                          formkikAssign.errors.unity_id && (
                            <div className="fv-plugins-message-container">
                              <span role="alert">
                                {formkikAssign.errors.unity_id}
                              </span>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}

              </div>

              {chooseWhoToAssignTheClaim == 1 && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    onClick={() => chooseWhichOneToAssignTheClaim(0)}
                  >
                    {intl.formatMessage({ id: 'GEN.CANCEL' })}
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      formkikAssign.isSubmitting || !formkikAssign.isValid
                    }
                  >
                    {!qualifyClaimLoader && (
                      <span className="indicator-label">
                        {intl.formatMessage({ id: 'GEN.ASSIGN' })}
                      </span>
                    )}
                    {qualifyClaimLoader && (
                      <span
                        className="indicator-progress"
                        style={{ display: 'block' }}
                      >
                        {intl.formatMessage({ id: 'GEN.WAIT' })}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* assign claim to another user modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3P">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formkikAssignToAnotherUser.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikAssignToAnotherUser"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.CLAIM_ASSIGNMENT' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikAssignToAnotherUser"
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
                    {intl.formatMessage({ id: 'SETTINGS.UNITY' })}
                  </label>

                  {gettingUnitiesDatasLoader && (
                    <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                  )}

                  {!gettingUnitiesDatasLoader && (
                    <>
                      <select
                        className={clsx('form-control bg-transparent')}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        onChange={(e) => getUsersListByUnityId(e.target.value)}
                      >
                        <option>Veuillez selectionner l'unité</option>

                        {unitiesDatas?.map((row, index) => (
                          <option key={index} value={row.id}>
                            {row.libelle}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div className="fv-row mb-8">
                  {gettingUsersDatasByUnityLoader == 1 && (
                    <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
                  )}

                  {gettingUsersDatasByUnityLoader == 2 && (
                    <>
                      <label className="form-label fs-6 fw-bolder text-gray-900 mt-3 required">
                        {intl.formatMessage({ id: 'GEN.AGENT' })}
                      </label>

                      <select
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikAssignToAnotherUser.touched.user_id &&
                              formkikAssignToAnotherUser.errors.user_id,
                          },
                          {
                            'is-valid':
                              formkikAssignToAnotherUser.touched.user_id &&
                              !formkikAssignToAnotherUser.errors.user_id,
                          },
                        )}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formkikAssignToAnotherUser.getFieldProps('user_id')}
                      >
                        <option>Veuillez selectionner l'Agent</option>

                        {usersDatas?.map((row, index) => (
                          <option key={index} value={row.id}>
                            {row.profile.first_name} {row.profile.last_name} |{' '}
                            {row.fonction}
                          </option>
                        ))}
                      </select>

                      {formkikAssignToAnotherUser.touched.user_id &&
                        formkikAssignToAnotherUser.errors.user_id && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">
                              {formkikAssignToAnotherUser.errors.user_id}
                            </span>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => chooseWhichOneToAssignTheClaim(0)}
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formkikAssignToAnotherUser.isSubmitting ||
                    !formkikAssignToAnotherUser.isValid
                  }
                >
                  {!qualifyAssignLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.ASSIGN' })}
                    </span>
                  )}
                  {qualifyAssignLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* founded claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_4">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formkikFounded.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikFounded"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.CLAIM_FOUNDED' })} ?
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikFounded"
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
                    {intl.formatMessage({ id: 'CLAIM.MOTIF' })}
                  </label>

                  <input
                    placeholder={intl.formatMessage({ id: 'CLAIM.MOTIF' })}
                    {...formkikFounded.getFieldProps('motif')}
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikFounded.touched.motif &&
                          formkikFounded.errors.motif,
                      },
                      {
                        'is-valid':
                          formkikFounded.touched.motif &&
                          !formkikFounded.errors.motif,
                      },
                    )}
                    type="text"
                    name="motif"
                    autoComplete="on"
                  />
                  {formkikFounded.touched.motif &&
                    formkikFounded.errors.motif && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formkikFounded.errors.motif}</span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900 required">
                    {intl.formatMessage({ id: 'GEN.SOLUTION' })}
                  </label>

                  <textarea
                    id=""
                    cols={30}
                    rows={3}
                    placeholder={intl.formatMessage({ id: 'GEN.SOLUTION' })}
                    {...formkikFounded.getFieldProps('solution')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formkikFounded.touched.solution &&
                          formkikFounded.errors.solution,
                      },
                      {
                        'is-valid':
                          formkikFounded.touched.solution &&
                          !formkikFounded.errors.solution,
                      },
                    )}
                  ></textarea>

                  {formkikFounded.touched.solution &&
                    formkikFounded.errors.solution && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formkikFounded.errors.solution}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'GEN.IS_FOUNDED' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikFounded.touched.is_founded &&
                          formkikFounded.errors.is_founded,
                      },
                      {
                        'is-valid':
                          formkikFounded.touched.is_founded &&
                          !formkikFounded.errors.is_founded,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formkikFounded.getFieldProps('is_founded')}
                  >
                    <option>Sélectionner</option>
                    {foundedVal?.map((row, index) => (
                      <option key={index} value={row.val}>
                        {intl.formatMessage({ id: row.name })}
                      </option>
                    ))}
                  </select>

                  {formkikFounded.touched.is_founded &&
                    formkikFounded.errors.is_founded && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formkikFounded.errors.is_founded}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formkikFounded.isSubmitting || !formkikFounded.isValid
                  }
                >
                  {!foundClaimLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {foundClaimLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* satisfaction claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_5">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formkikSatisfaiing.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikSatisfaiing"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIM.SATISFACTION_FORM' })} ?
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikSatisfaiing"
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
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'CLAIM.IS_SATISFIED' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent h-40px',
                      {
                        'is-invalid':
                          formkikSatisfaiing.touched.isSatisfied &&
                          formkikSatisfaiing.errors.isSatisfied,
                      },
                      {
                        'is-valid':
                          formkikSatisfaiing.touched.isSatisfied &&
                          !formkikSatisfaiing.errors.isSatisfied,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formkikSatisfaiing.getFieldProps('isSatisfied')}
                  >
                    <option>Sélectionner</option>
                    {foundedVal?.map((row, index) => (
                      <option key={index} value={row.val}>
                        {intl.formatMessage({ id: row.name })}
                      </option>
                    ))}
                  </select>

                  {formkikSatisfaiing.touched.isSatisfied &&
                    formkikSatisfaiing.errors.isSatisfied && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formkikSatisfaiing.errors.isSatisfied}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label mb-3 required">
                    {intl.formatMessage({ id: 'CLAIM.LEVEL' })}
                  </label>

                  {gettingLevelLoader ? (
                    <LOADER_INPUTLOADER />
                  ) : (
                    <>
                      <select
                        className={clsx(
                          'form-control bg-transparent h-40px',
                          {
                            'is-invalid':
                              formkikSatisfaiing.touched.level_id &&
                              formkikSatisfaiing.errors.level_id,
                          },
                          {
                            'is-valid':
                              formkikSatisfaiing.touched.level_id &&
                              !formkikSatisfaiing.errors.level_id,
                          },
                        )}
                        data-control="select2"
                        data-placeholder="Latest"
                        data-hide-search="true"
                        {...formkikSatisfaiing.getFieldProps('level_id')}
                      >
                    <option>Sélectionner</option>
                        {levelDatas?.map((row, index) => (
                          <option key={index} value={row.id}>
                            {row.label}
                          </option>
                        ))}
                      </select>

                      {formkikSatisfaiing.touched.level_id &&
                        formkikSatisfaiing.errors.level_id && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">
                              {formkikSatisfaiing.errors.level_id}
                            </span>
                          </div>
                        )}
                    </>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 text-gray-900">
                    {intl.formatMessage({ id: 'CLAIM.COMMENT' })}
                  </label>

                  <textarea
                    id=""
                    cols={30}
                    rows={3}
                    placeholder={intl.formatMessage({ id: 'CLAIM.COMMENT' })}
                    {...formkikSatisfaiing.getFieldProps('comment')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formkikSatisfaiing.touched.comment &&
                          formkikSatisfaiing.errors.comment,
                      },
                      {
                        'is-valid':
                          formkikSatisfaiing.touched.comment &&
                          !formkikSatisfaiing.errors.comment,
                      },
                    )}
                  ></textarea>

                  {formkikSatisfaiing.touched.comment &&
                    formkikSatisfaiing.errors.comment && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formkikSatisfaiing.errors.comment}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formkikSatisfaiing.isSubmitting ||
                    !formkikSatisfaiing.isValid
                  }
                >
                  {!foundClaimLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {foundClaimLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* validate claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_6">
        <div className="modal-dialog">
          <form
            className="form w-900"
            onSubmit={formkikValidate.handleSubmit}
            noValidate
            id="kt_login_signin_form_formkikValidate"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'CLAIMS.VALIDATION' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formkikValidate"
                  aria-label="Close"
                >
                  <KTSVG
                    path="media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  />
                </div>
              </div>

              <div className="modal-body">
                {gettingProcessDatasLoader ? (
                  <h3 className="col-12 text-center">
                    {intl.formatMessage({ id: 'GEN.WAIT' })}
                  </h3>
                ) : (
                  <>
                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900 required">
                        {intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
                      </label>

                      <input
                        placeholder={intl.formatMessage({ id: 'CLAIM.AMOUNT' })}
                        {...formkikValidate.getFieldProps('amount')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikValidate.touched.amount &&
                              formkikValidate.errors.amount,
                          },
                          {
                            'is-valid':
                              formkikValidate.touched.amount &&
                              !formkikValidate.errors.amount,
                          },
                        )}
                        type="number"
                        name="amount"
                        autoComplete="on"
                      />
                      {formkikValidate.touched.amount &&
                        formkikValidate.errors.amount && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">Amount Required</span>
                          </div>
                        )}
                    </div>

                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900 required">
                        {intl.formatMessage({ id: 'GEN.SOLUTION' })}
                      </label>

                      <textarea
                        id=""
                        cols={30}
                        rows={3}
                        placeholder={intl.formatMessage({ id: 'GEN.SOLUTION' })}
                        {...formkikValidate.getFieldProps('solution')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikValidate.touched.solution &&
                              formkikValidate.errors.solution,
                          },
                          {
                            'is-valid':
                              formkikValidate.touched.solution &&
                              !formkikValidate.errors.solution,
                          },
                        )}
                      ></textarea>

                      {formkikValidate.touched.solution &&
                        formkikValidate.errors.solution && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">Solution Required</span>
                          </div>
                        )}
                    </div>

                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900 required">
                        {intl.formatMessage({ id: 'GEN.PREVENTION_ACTION' })}
                      </label>

                      <textarea
                        id=""
                        cols={30}
                        rows={3}
                        placeholder={intl.formatMessage({
                          id: 'GEN.PREVENTION_ACTION',
                        })}
                        {...formkikValidate.getFieldProps('preventive_action')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikValidate.touched.preventive_action &&
                              formkikValidate.errors.preventive_action,
                          },
                          {
                            'is-valid':
                              formkikValidate.touched.preventive_action &&
                              !formkikValidate.errors.preventive_action,
                          },
                        )}
                      ></textarea>

                      {formkikValidate.touched.preventive_action &&
                        formkikValidate.errors.preventive_action && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">Preventive action Required</span>
                          </div>
                        )}
                    </div>

                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900">
                        {intl.formatMessage({ id: 'GEN.COMMENT' })}
                      </label>

                      <textarea
                        id=""
                        cols={30}
                        rows={3}
                        placeholder={intl.formatMessage({ id: 'GEN.COMMENT' })}
                        {...formkikValidate.getFieldProps('comment')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikValidate.touched.comment &&
                              formkikValidate.errors.comment,
                          },
                          {
                            'is-valid':
                              formkikValidate.touched.comment &&
                              !formkikValidate.errors.comment,
                          },
                        )}
                      ></textarea>

                      {formkikValidate.touched.comment &&
                        formkikValidate.errors.comment && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">Comment Required</span>
                          </div>
                        )}
                    </div>

                    

                    <div className="fv-row mb-8">
                      <label className="form-label fs-6 fw-bolder text-gray-900 required">
                        {intl.formatMessage({ id: 'CLAIM.MESSAGE_TO_SEND' })}
                      </label>

                      <textarea
                        id=""
                        cols={30}
                        rows={3}
                        placeholder={intl.formatMessage({ id: 'CLAIM.MESSAGE_TO_SEND' })}
                        {...formkikValidate.getFieldProps('message_to_send')}
                        className={clsx(
                          'form-control bg-transparent',
                          {
                            'is-invalid':
                              formkikValidate.touched.message_to_send &&
                              formkikValidate.errors.message_to_send,
                          },
                          {
                            'is-valid':
                              formkikValidate.touched.message_to_send &&
                              !formkikValidate.errors.message_to_send,
                          },
                        )}
                      ></textarea>

                      {/* {formkikValidate.touched.comment &&
                        formkikValidate.errors.comment && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">Comment Required</span>
                          </div>
                        )} */}
                    </div>

                  </>
                )}

                <h3 className="col-12 text-danger text-center">
                  {errorMsg ? errorMsg : ''}
                </h3>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  {intl.formatMessage({ id: 'GEN.CANCEL' })}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formkikValidate.isSubmitting || !formkikValidate.isValid
                  }
                >
                  {!processClaimLoader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'GEN.VALID' })}
                    </span>
                  )}
                  {processClaimLoader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* resend notify claim modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_7">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {intl.formatMessage({ id: 'CLAIMS.NOTIFYING' })}
              </h5>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                id="modal_close-sendNotificationToTheClientAboutHisComplaint"
                aria-label="Close"
              >
                <KTSVG
                  path="media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
                />
              </div>
            </div>

            <div className="modal-body">
              <h3 className="col-12 fv-row mb-18">
                {intl.formatMessage({
                  id: 'CLAIMS.NOTIFY.RECEPTION_CHANNEL_CHOOSED_IS',
                })}
                <span className="text-danger">
                  {claim?.response_channel.libelle}
                </span>
              </h3>

              {sendingNotificationLoader == 0 && (
                <div className="row">
                  <div className="col-12 fv-row mb-8 d-flex">
                    <img
                      src={toAbsoluteUrl(`media/gifs/notification.png`)}
                      style={{ maxWidth: '14rem', margin: '0 auto' }}
                      alt=""
                    />
                  </div>

                  <h3 className="col-12 fv-row mb-8  text-center">
                    {intl.formatMessage({ id: 'CLAIMS.NOTIFY.MSG_BEFORE' })}
                  </h3>
                </div>
              )}

              {sendingNotificationLoader == 1 && (
                <div className="row">
                  <div className="col-12 fv-row mb-8 d-flex">
                    <img
                      src={toAbsoluteUrl(`media/gifs/message.gif`)}
                      style={{ maxWidth: '14rem', margin: '0 auto' }}
                      alt=""
                    />
                  </div>

                  <h3 className="col-12 fv-row mb-8 text-center">
                    {intl.formatMessage({ id: 'CLAIMS.NOTIFY.DURING_SENDING' })}
                  </h3>
                </div>
              )}

              {sendingNotificationLoader == 2 && (
                <div className="row">
                  <div className="col-12 fv-row mb-8 d-flex">
                    <img
                      src={toAbsoluteUrl(`media/gifs/failed-message.png`)}
                      style={{ maxWidth: '14rem', margin: '0 auto' }}
                      alt=""
                    />
                  </div>

                  <h3 className="col-12 fv-row mb-8  text-center">
                    {intl.formatMessage({ id: 'CLAIMS.NOTIFY.NOT_SENDED' })}
                  </h3>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setsendingNotificationLoader(0)}
              >
                {intl.formatMessage({ id: 'GEN.CANCEL' })}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => sendNotificationToTheClientAboutHisComplaint()}
              >
                {(sendingNotificationLoader == 0 ||
                  sendingNotificationLoader == 2) && (
                  <span className="indicator-label">
                    {intl.formatMessage({ id: 'CLAIMS.NOTIFY' })}
                  </span>
                )}
                {sendingNotificationLoader == 1 && (
                  <span
                    className="indicator-progress"
                    style={{ display: 'block' }}
                  >
                    {intl.formatMessage({ id: 'GEN.WAIT' })}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {claimloader ? (
        <>
          <div className="d-flex justify-content-center">
            <h1 className="spinner-SATIS-border" role="status">
              Loading...
            </h1>
          </div>
        </>
      ) : (
        <>
          <div className="row justify-content-between">
            <h4 className="col-3 mb-8">
              {claim ? claim.reference : ''}

              {claim ? (
                <>
                  ;
                  <span className={`status-${claim.status.libelle} badge`}>
                    {claim
                      ? intl.formatMessage({
                          id: `CLAIMS_STATUS.${claim.status.libelle}`,
                        })
                      : ''}
                  </span>
                </>
              ) : (
                ''
              )}
            </h4>

            <div className="row col-9 justify-content-end card-toolbar">
              {checkIfStatusIsVerified('UNCOMPLETED', claim.status) && (
                // true

                <div className="col-3">
                  <a
                    type="button"
                    href={'/claims/update/' + claim?.id}
                    className="btn btn-warning width-100 btn-active-secondary btn-active-color-white"
                    onClick={() => goToCompleteClaim()}
                  >
                    {intl.formatMessage({ id: 'CLAIMS.COMPLETE' })}
                  </a>
                </div>
              )}

              {checkIfStatusIsVerified('COMPLETED', claim.status) && (
                // true

                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-primary width-100 btn-active-secondary btn-active-color-white"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_1"
                  >
                    {intl.formatMessage({ id: 'CLAIM.QUALIFY_THE_CLAIM' })}
                  </button>
                </div>
              )}

              {checkIfStatusIsVerified('QUALIFY', claim.status) && (
                // true

                <>
                  <div className="col-3">
                    <button
                      type="button"
                      className="btn btn-primary width-100 btn-active-secondary btn-active-color-white"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_3"
                    >
                      {intl.formatMessage({ id: 'GEN.ASSIGN' })}
                    </button>
                  </div>
                </>
              )}

              {(checkIfStatusIsVerified('QUALIFY', claim.status) ||
                checkIfStatusIsVerified('IN_PROCESS', claim.status) ||
                checkIfStatusIsVerified('PROCESSED', claim.status) ||
                checkIfStatusIsVerified('VALIDATE', claim.status) ||
                checkIfStatusIsVerified('NOTIFY', claim.status) ||
                checkIfStatusIsVerified('CLOSED', claim.status)) &&
                claimHasBeenFounded == 0 && (
                  // true

                  <div className="col-3">
                    <button
                      type="button"
                      className="btn btn-primary width-100 btn-active-secondary btn-active-color-white"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_4"
                    >
                      {intl.formatMessage({ id: 'GEN.IS_FOUNDED' })}
                    </button>
                  </div>
                )}

              {checkIfStatusIsVerified('IN_PROCESS', claim.status) && (
                // true

                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-info width-100 btn-active-secondary btn-active-color-white"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_2"
                  >
                    {intl.formatMessage({ id: 'GEN.TREATMENT' })}
                  </button>
                </div>
              )}

              {checkIfStatusIsVerified('PROCESSED', claim.status) && (
                // true

                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-info width-100 btn-active-secondary btn-active-color-white"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_6"
                  >
                    {intl.formatMessage({ id: 'GEN.VALID' })}
                  </button>
                </div>
              )}

              {checkIfStatusIsVerified('VALIDATE', claim.status) && (
                // true

                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-warning width-100 btn-active-secondary btn-active-color-white"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_7"
                  >
                    {intl.formatMessage({ id: 'CLAIMS.NOTIFY' })}
                  </button>
                </div>
              )}

              {checkIfStatusIsVerified('CLOSED', claim.status) && (
                // true

                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-info width-100 btn-active-secondary btn-active-color-white"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_5"
                  >
                    {intl.formatMessage({ id: 'GEN.SATISFACTION' })}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div id="kt_activities" className="bg-body">
            {!claimloader ? (
              <div className="card shadow-none rounded-0">
                <div
                  className="card-body position-relative"
                  id="kt_activities_body"
                >
                  <div
                    id="kt_activities_scroll"
                    className="position-relative scroll-y me-n5 pe-5"
                    data-kt-scroll="true"
                    data-kt-scroll-height="auto"
                    data-kt-scroll-wrappers="#kt_activities_body"
                    data-kt-scroll-dependencies="#kt_activities_header, #kt_activities_footer"
                    data-kt-scroll-offset="5px"
                  >
                    {claim && (
                      <>
                        <div className="timeline">

                          <DetailsStep1AssuranceDatas _claim={claim} />
                          <DetailsStep2BasicDatas _claim={claim} />
                          <DetailsStep3AdvencedDatas _claim={claim} />
                          <DetailsStep4CustomerDatas _claim={claim} />
                          <DetailsStep5ProofsDatas _claim={claim} />

                          {

                            claimProcess &&

                            <div className="timeline-item">
                              <div className="timeline-line w-40px"></div>
  
                              <div className="timeline-icon symbol symbol-circle symbol-40px">
                                <div className="symbol-label bg-light">
                                  <KTIcon iconName="category" className="fs-2 text-primary-500" />
                                </div>
                              </div>
  
                              <div className="timeline-content mb-10 mt-n1">
  
                                <div className="overflow-auto pe-3">
                                  <div className="fs-5 fw-bold mt-4 text-primary">
                                  {intl.formatMessage({ id: 'CLAIMS.TREATMENT' })}
                                  </div>
                                </div>
  
                                <div className="overflow-auto pb-">
  
                                  <h3> <strong>{intl.formatMessage({ id: 'GEN.SOLUTION' })} : </strong>{claimProcess.solution}</h3>
  
                                </div>
  
                                <div className="overflow-auto pb-5 mt-2">
  
                                  <h3><strong>{intl.formatMessage({ id: 'GEN.PREVENTION_ACTION' })} : </strong> {claimProcess.preventive_action}</h3>
  
                                </div>
  
                              </div>
                            </div>

                          }

                          {

                            claimSatisfaction &&

                            <div className="timeline-item">
                              <div className="timeline-line w-40px"></div>
  
                              <div className="timeline-icon symbol symbol-circle symbol-40px">
                                <div className="symbol-label bg-light">
                                  <KTIcon iconName="colors-square" className="fs-2 text-danger-500" />
                                </div>
                              </div>
  
                              <div className="timeline-content mb-10 mt-n1">
  
                                <div className="overflow-auto pe-3">
                                  <div className="fs-5 fw-bold mt-4 text-danger">
                                  {intl.formatMessage({ id: 'CLAIM.SATISFACTION_FORM' })}
                                  </div>
                                </div>
  
                                <div className="overflow-auto pb-">
  
                                  <h3> <strong>{intl.formatMessage({ id: 'CLAIM.COMMENT' })} : </strong>{claimSatisfaction.comment}</h3>
  
                                </div>
  
                              </div>
                            </div>

                          }

                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  );
};

export { ClaimDetails };
