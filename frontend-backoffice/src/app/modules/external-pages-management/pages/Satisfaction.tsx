/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { handleHttpError } from '../../../utils/functions';
import { ClaimModel } from '../../gestion-reclamation/core/models/Claim';
import { LevelModel } from '../../gestion-paramettres/core/models/Level';
import { ClaimRequest } from '../../gestion-reclamation/core/services/ClaimRequest';
import { ClaimSatisfactionFormRequests } from '../../gestion-reclamation/core/services/ClaimSatisfactionFormRequests';
import { LevelRequests } from '../../gestion-paramettres/core/services/LevelRequests';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { ClaimProcessRequests } from '../../gestion-reclamation/core/services/ClaimProcessRequests';
import { ClaimProcessModel } from '../../gestion-reclamation/core/models/ClaimProcess';

const claimSatisfaiingSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
  level_id: Yup.number().required('Level is required'),
  isSatisfied: Yup.number().required('this question is required'),
});

const toSatisfaingValue = {
  level_id: null,
  comment: '',
  isSatisfied: null,
};

const claimRequest = new ClaimRequest();
const claimSatifactionFormRequests = new ClaimSatisfactionFormRequests();
const levelRequests = new LevelRequests();
const claimProcessRequest = new ClaimProcessRequests();

export function Satisfaction() {
  const claimId: any = useParams()['claim_id'];

  const [surveyIsSubmited, setsurveyIsSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimloader, setclaimloader] = useState(true);
  const [gettingLevelLoader, setgettingLevelLoader] = useState(false);

  const [claim, setClaim] = useState<ClaimModel | any>();
  const [levelDatas, setlevelDatas] = useState(Array<LevelModel>);
  const [claimProcess, setclaimProcess] = useState<ClaimProcessModel | any>();

  const [hassatisfactionErrorMessage, setHasSatisfactionErrorMessage] = useState(false);

  const intl = useIntl();

  const YES_OR_NO_VALUES = [
    {
      name: 'GEN.NO',
      val: 0,
    },
    {
      name: 'GEN.YES',
      val: 1,
    },
  ];

  const formkikSatisfaiing = useFormik({
    initialValues: toSatisfaingValue,
    validationSchema: claimSatisfaiingSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {

      setSubmitting(true);

      const satisfaction_datas = {
        ...values,
        process_id: claimProcess.claim.id,
        isSatisfied: Boolean(values.isSatisfied),
      };

      // console.log(satisfaction_datas);

      // @ts-ignore
      await claimSatifactionFormRequests.addClaimSatisfactionForm(satisfaction_datas, claim.id, values.level_id)
        .then((response: any) => {
          setStatus(false);
          setSubmitting(false);
          setsurveyIsSubmited(true);
          notificationSuccessToast(
            intl.formatMessage({
              id: 'NOTIFS.CLAIMS_NOTIFS.SATISFAING.SUCCESS',
            }),
            5000,
          );
        })
        .catch((error: any) => {
          setHasSatisfactionErrorMessage(true)
          setStatus(false);
          setSubmitting(false);
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

  const getProcessByClaimId = async (claimId: number) => {
    await claimProcessRequest
      .getClaimProcessByClaimId(claimId)
      .then((response: any) => {
        // console.log(response.data)
        setclaimProcess(response.data);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getClaimById(claimId);
    getProcessByClaimId(claimId);
    getLevelList();
  }, []);

  return (
    <form
      className="form w-100"
      onSubmit={formkikSatisfaiing.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="text-center mb-11">
        <h4 className="text-gray-900 fw-bolder mb-3">
          {intl.formatMessage({ id: 'CLAIM.SATISFAGNING_MSG' })}
        </h4>
      </div>

      <div className="text-center mb-11">
        <h4 className="text-gray-900 fw-bolder mb-3">
          Ref :{' '}
          <span className="text-danger fw-bolder">
            {claim?.reference ?? '..'}
          </span>
        </h4>
      </div>

      {
        hassatisfactionErrorMessage ?
        <h2 className="text-center">
          Désolé ! Mais, le formulaire de satisfaction de cette reclamation a déjà été rempli
        </h2>
        :
        (!surveyIsSubmited ? (
          <>
            <div className="fv-row mb-8">
              <label className="form-label mb-3">
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
                <option >Veuillez choisir...</option>
                {YES_OR_NO_VALUES?.map((row, index) => (
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
              <label className="form-label mb-3">
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
                    <option >Veuillez choisir...</option>
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
                    <span role="alert">{formkikSatisfaiing.errors.comment}</span>
                  </div>
                )}
            </div>

            <div className="d-grid mb-10">
              <button
                type="submit"
                id="kt_sign_in_submit"
                className="btn btn-primary btn-active-secondary btn-active-color-white"
                disabled={
                  formkikSatisfaiing.isSubmitting || !formkikSatisfaiing.isValid
                }
              >
                {!formkikSatisfaiing.isSubmitting && (
                  <span className="indicator-label">
                    {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                  </span>
                )}
                {formkikSatisfaiing.isSubmitting && (
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
          </>
        ) : (
          <h2 className="text-center">
            Merci pour votre confiance 😊. Au plaisir de vous servir à nouveau !
          </h2>
        ))
      }

    </form>
  );
}
