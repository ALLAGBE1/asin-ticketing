/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { ErrorMessage, Field } from 'formik';
import { useIntl } from 'react-intl';
import { ComplaintTypeModel } from '../../../gestion-paramettres/core/models/ComplaintType';
// import { ComplaintTypeRequest } from '../../../gestion-paramettres/core/services/ComplaintsTypeRequest'
// import { ProductRequest } from '../../../gestion-paramettres/core/services/ProductRequests'
import { InsurranceTypeRequest } from '../../../gestion-paramettres/core/services/InsurranceTypeRequest';
import { ProductModel } from '../../../gestion-paramettres/core/models/Product';
import { InsurranceTypeModel } from '../../../gestion-paramettres/core/models/InsurranceType';
import { ComplaintObjectModel } from '../../../gestion-paramettres/core/models/ComplaintObject';
import { ComplaintCategoryModel } from '../../../gestion-paramettres/core/models/ComplaintCategory';
import { ComplaintObjectRequest } from '../../../gestion-paramettres/core/services/ComplaintsObjectRequest';
import { ComplaintCategoryRequest } from '../../../gestion-paramettres/core/services/ComplaintsCategoryRequest';
import { LOADER_INPUTLOADER } from '../../../../utils/contents-loader/LOADER_INPUT_LOADER';
import { notificationErrorToast } from '../../../../utils/notificationToasts';
import { handleHttpError } from '../../../../utils/functions';

const NewClaimStep1InsurranceDatas: FC<any> = (props) => {
  const intl = useIntl();

  // const complaintTypeRequest = new ComplaintTypeRequest()
  // const productRequest = new ProductRequest()
  const insurranceTypeRequest = new InsurranceTypeRequest();
  const complaintObjectRequest = new ComplaintObjectRequest();
  const complaintCategoriesRequest = new ComplaintCategoryRequest();

  const [complaintTypeDatas, setcomplaintTypeDatas] = useState(
    Array<ComplaintTypeModel>,
  );
  const [productDatas, setproductDatas] = useState(Array<ProductModel>);
  const [insurranceTypeDatas, setInsurranceTypeDatas] = useState(
    Array<InsurranceTypeModel>,
  );
  const [complaintObjectDatas, setComplaintObjectDatas] = useState(
    Array<ComplaintObjectModel>,
  );
  const [complaintCategoriesDatas, setComplaintCategoriesDatas] = useState(
    Array<ComplaintCategoryModel>,
  );
  const [complaintCategoryDatas, setcomplaintCategoryDatas] = useState(
    Array<ComplaintCategoryModel>,
  );

  const [loaderObjectDatas, setLoaderObjectDatas] = useState(true);
  const [loaderCategoriesDatas, setLoaderCategoriesDatas] = useState(true);
  const [complaintObjectLoader, setcomplaintObjectLoader] = useState(0);

  const [isUpdating, setisUpdating] = useState(false);

  const getInsurranceTypeList = async () => {
    await insurranceTypeRequest
      .getInsurranceTypeList()
      .then((response: any) => {
        setInsurranceTypeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintObjectByCategoryIdList = async () => {
    setLoaderObjectDatas(true);

    await complaintObjectRequest
      .getComplaintObjectList()
      .then((response: any) => {
        setComplaintObjectDatas(response.data.items);
        setLoaderObjectDatas(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getClaimObjectByCategoriId = async (categoryId: number) => {
    setcomplaintObjectLoader(1);

    await complaintObjectRequest
      .getComplaintObjectListByCategpriId(categoryId)
      .then((response: any) => {
        console.log(response.data);
        setComplaintObjectDatas(response.data);
        setcomplaintObjectLoader(2);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintCategoriesList = async () => {
    await complaintCategoriesRequest
      .getComplaintCategoriesList()
      .then((response: any) => {
        setComplaintCategoriesDatas(response.data.items);
        setLoaderCategoriesDatas(false);

        // if is an updating process
        if (props.isUpdating) {
          getClaimObjectByCategoriId(props.claimCategoryId);
        }
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const chooseCategory = async (event: any) => {
    console.log(event.target.value);

    setcomplaintObjectLoader(1);

    const categoryId = event.target.value;

    getClaimObjectByCategoriId(categoryId);
  };

  useEffect(() => {
    getComplaintCategoriesList();
    // getComplaintObjectByCategoryIdList();

    if (props.isUpdating) {
      // console.log(props.isUpdating)
      // console.log(props.claimCategoryId)
      setisUpdating(props.isUpdating);
      setcomplaintObjectLoader(2);
    }
  }, []);

  return (
    <>
      <div className="w-100">
        <div className="pb-10 pb-lg-15">
          <h2 className="fw-bolder d-flex align-items-center text-gray-900">
            {intl.formatMessage({ id: 'CLAIM.INSURRANCE_DATAS' })}
            {/* <i
              className='fas fa-exclamation-circle ms-2 fs-7'
              data-bs-toggle='tooltip'
              title='Billing is issued based on your selected account type'
            ></i> */}
          </h2>

          <div className="text-gray-500 fw-bold fs-6">
            {intl.formatMessage({ id: 'CLAIM.INSURRANCE_DATAS_DESCRIPTION' })}
            {/* <a href='/dashboard' className='link-primary fw-bolder'>
              {' '}
              Help Page
            </a>
            . */}
          </div>
        </div>

        <div className="fv-row">
          <div className="row">
            <div className="fv-row mb-8">
              <label className="form-label mb-3 required">
                {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
              </label>

              {loaderCategoriesDatas ? (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              ) : (
                <>
                  <select
                    onChange={() => chooseCategory(event)}
                    className="form-control bg-transparent"
                    value={props?.claimCategoryId}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                  >
                    <option>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({
                          id: 'SETTINGS.COMPLAINT_CATEGORY',
                        })}
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

            <div className="fv-row mb-8">
              <label className="form-label fs-6 text-gray-900 required">
                {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
              </label>

              {complaintObjectLoader == 1 && (
                <LOADER_INPUTLOADER></LOADER_INPUTLOADER>
              )}

              {complaintObjectLoader == 2 && (
                <>
                  <Field
                    as="select"
                    name="object_id"
                    className="form-control bg-transparent"
                  >
                    <option>
                      {intl.formatMessage({ id: 'GEN.CHOOSE' }) +
                        intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
                    </option>

                    {complaintObjectDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </Field>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="object_id" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { NewClaimStep1InsurranceDatas };
