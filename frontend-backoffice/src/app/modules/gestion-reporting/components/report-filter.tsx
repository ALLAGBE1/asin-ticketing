/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { FC, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import '../GestionReporting.css';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
  notificationErrorToast,
  notificationSuccessToast,
} from '../../../utils/notificationToasts';
import { getGenderAvatar, handleHttpError } from '../../../utils/functions';
import { ComplaintCategoryRequest } from '../../gestion-paramettres/core/services/ComplaintsCategoryRequest';
import { ComplaintObjectRequest } from '../../gestion-paramettres/core/services/ComplaintsObjectRequest';
import { UnityRequest } from '../../gestion-paramettres/core/services/UnityRequests';
import { ReceivingChannelRequest } from '../../gestion-paramettres/core/services/ReceivingChannelRequests';
import { ComplaintCategoryModel } from '../../gestion-paramettres/core/models/ComplaintCategory';
import { ComplaintObjectModel } from '../../gestion-paramettres/core/models/ComplaintObject';
import { UnityModel } from '../../gestion-paramettres/core/models/Unity';
import { ReceivingChannelModel } from '../../gestion-paramettres/core/models/ReceivingChannel';
import { LOADER_INPUTLOADER } from '../../../utils/contents-loader/LOADER_INPUT_LOADER';

const complaintCategoryRequest = new ComplaintCategoryRequest();
const complaintObjectRequest = new ComplaintObjectRequest();
const unityRequest = new UnityRequest();
const receivingChannelRequest = new ReceivingChannelRequest();

const ReportFilter: FC<any> = (props) => {
  const intl = useIntl();
  const [gettingLogsLoader, setgettingLogsLoader] = useState(false);
  const [submitLoader, setsubmitLoader] = useState(false);
  const [userLoginLogsDatas, setuserLoginLogsDatas] = useState(Array<any>);

  const [complaintCategoriesloader, setComplaintCategoriesloader] =
    useState(true);
  const [complaintCategoriesDatas, setComplaintCategoriesDatas] = useState(
    Array<ComplaintCategoryModel | any>,
  );

  const [complaintObjectloader, setcomplaintObjectloader] = useState(true);
  const [complaintObjectDatas, setcomplaintObjectDatas] = useState(
    Array<ComplaintObjectModel | any>,
  );

  const [unityloader, setUnityloader] = useState(true);
  const [unityDatas, setUnityDatas] = useState(Array<UnityModel | any>);

  const [receivingChannelloader, setreceivingChannelloader] = useState(true);
  const [receivingChannelDatas, setreceivingChannelDatas] = useState(
    Array<ReceivingChannelModel>,
  );

  const updateCategoryFilter = (data: any) => {
    props._changeCategory(data.target.value);
    getClaimObjectByCategoriId(data.target.value);
  };

  const updateObjectFilter = (data: any) => {
    props._changeObject(data.target.value);
  };

  const updateUnityFilter = (data: any) => {
    props._changeUnity(data.target.value);
  };

  const updateReceptionChannelFilter = (data: any) => {
    props._changeReceptionChannel(data.target.value);
  };

  const updateStartDateFilter = (data: any) => {
    props._changeStartDate(data.target.value);
  };

  const updateEndDateFilter = (data: any) => {
    props._changeEndDate(data.target.value);
  };

  const getComplaintCategoryList = async () => {
    setComplaintCategoriesloader(true);

    await complaintCategoryRequest
      .getComplaintCategoriesList()
      .then((response: any) => {
        setComplaintCategoriesDatas(response.data.items);
        console.log(response.data.items);
        setComplaintCategoriesloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintObjects = async () => {
    setcomplaintObjectloader(true);

    await complaintObjectRequest
      .getComplaintObjectList()
      .then((response: any) => {
        setcomplaintObjectDatas(response.data.items);
        console.log(response.data.items);
        setcomplaintObjectloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getUnitiesList = async () => {
    setUnityloader(true);

    await unityRequest
      .getUnityList()
      .then((response: any) => {
        setUnityDatas(response.data.items);
        console.log(response.data.items);
        setUnityloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getReveivingChannelList = async () => {
    setreceivingChannelloader(true);

    await receivingChannelRequest
      .getReceivingChannelList()
      .then((response: any) => {
        setreceivingChannelDatas(response.data.items);
        console.log(response.data.items);
        setreceivingChannelloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimObjectByCategoriId = async (categoryId: number) => {
    setcomplaintObjectloader(true);

    await complaintObjectRequest
      .getComplaintObjectListByCategpriId(categoryId)
      .then((response: any) => {
        console.log(response.data);
        setcomplaintObjectDatas(response.data);
        setcomplaintObjectloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getComplaintCategoryList();
    getReveivingChannelList();
    getComplaintObjects();
    getUnitiesList();

    // updateFilter();
  }, []);

  return (
    <>
      <div className="container mt-8">
        <div className="row">

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
            </label>
            {complaintCategoriesloader ? (
              <LOADER_INPUTLOADER />
            ) : (
              <>
                <select
                  onChange={(e: any) =>
                    updateCategoryFilter(e)
                  }
                  className="form-control bg-transparent"
                  data-control="select2"
                  data-placeholder="Latest"
                  data-hide-search="true"
                >
                  <option value='0'>
                    {intl.formatMessage({ id: 'GEN.CHOOSE' })}
                  </option>

                  {complaintCategoriesDatas?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.libelle}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
            </label>
            {complaintObjectloader ? (
              <LOADER_INPUTLOADER />
            ) : (
              <>
                <select
                  onChange={(e: any) =>
                    updateObjectFilter(e)
                  }
                  className="form-control bg-transparent"
                  data-control="select2"
                  data-placeholder="Latest"
                  data-hide-search="true"
                >
                  <option value='0'>
                    {intl.formatMessage({ id: 'GEN.CHOOSE' })}
                  </option>

                  {complaintObjectDatas?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.libelle}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'SETTINGS.UNITY' })}
            </label>
            {unityloader ? (
              <LOADER_INPUTLOADER />
            ) : (
              <>
                <select
                  onChange={(e: any) =>
                    updateUnityFilter(e)
                  }
                  className="form-control bg-transparent"
                  data-control="select2"
                  data-placeholder="Latest"
                  data-hide-search="true"
                >
                  <option value='0'>
                    {intl.formatMessage({ id: 'GEN.CHOOSE' })}
                  </option>

                  {unityDatas?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.libelle}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'SETTINGS.RECEIVING_CHANNEL' })}
            </label>
            {receivingChannelloader ? (
              <LOADER_INPUTLOADER />
            ) : (
              <>
                <select
                  onChange={(e: any) =>
                    updateReceptionChannelFilter(e)
                  }
                  className="form-control bg-transparent"
                  data-control="select2"
                  data-placeholder="Latest"
                  data-hide-search="true"
                >
                  <option value='0'>
                    {intl.formatMessage({ id: 'GEN.CHOOSE' })}
                  </option>

                  {receivingChannelDatas?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.libelle}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'CLAIMS_REPORT.START_DATE' })}
            </label>
            <input
              type="date"
              className="form-control bg-transparent"
              onChange={(e: any) =>
                updateStartDateFilter(e)
              }
              placeholder={intl.formatMessage({
                id: 'CLAIMS_REPORT.START_DATE',
              })}
            />
          </div>

          <div className="fv-row mb-8 col-md-6 col-lg-4">
            <label className="form-label fs-6 fw-bolder text-gray-900">
              {intl.formatMessage({ id: 'CLAIMS_REPORT.END_DATE' })}
            </label>
            <input
              type="date"
              className="form-control bg-transparent"
              onChange={(e: any) =>
                updateEndDateFilter(e)
              }
              placeholder={intl.formatMessage({ id: 'CLAIMS_REPORT.END_DATE' })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { ReportFilter };
