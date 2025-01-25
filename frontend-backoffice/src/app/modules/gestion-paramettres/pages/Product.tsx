/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon, KTSVG } from '../../../../_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';

import '../GestionParamettres.css';
import { ProductModel } from '../core/models/Product';
import { InsurranceTypeModel } from '../core/models/InsurranceType';
import { ComplaintTypeModel } from '../core/models/ComplaintType';
import { ComplaintTypeRequest } from '../core/services/ComplaintsTypeRequest';
import { InsurranceTypeRequest } from '../core/services/InsurranceTypeRequest';
import { ProductRequest } from '../core/services/ProductRequests';
import { notificationErrorToast } from '../../../utils/notificationToasts';
import { closeModal, handleHttpError } from '../../../utils/functions';

const productShema = Yup.object().shape({
  libelle: Yup.string().required('Libelle is required'),
  type_id: Yup.string().required('Claim type is required'),
  insurance_type_id: Yup.string().required('Insurance Type is required'),
});

const productRequest = new ProductRequest();
const complaintTypeRequest = new ComplaintTypeRequest();
const insurranceTypeRequest = new InsurranceTypeRequest();

const Product: FC = () => {
  const intl = useIntl();

  const initialValues = new ProductModel();

  const toUpdateValue = new ProductModel();

  const [toDeleteValue, settoDeleteValue] = useState<ProductModel | any>();

  const [loading, setLoading] = useState(false);
  const [productloader, setproductloader] = useState(true);
  const [productDeleteloader, setproductDeleteloader] = useState(false);
  const [productDatas, setproductDatas] = useState(Array<ProductModel>);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [complainTypeDatas, setcomplainTypeDatas] = useState(
    Array<ComplaintTypeModel>,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [insurranceTypeDatas, setinsurranceTypeDatas] = useState(
    Array<InsurranceTypeModel>,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: productShema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await productRequest
        .addProduct(values)
        .then((response: any) => {
          closeModal('modal_close-formik');
          setSubmitting(false);
          setLoading(false);
          getProducts();
          formik.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  const formikUpdateproduct = useFormik({
    initialValues: toUpdateValue,
    validationSchema: productShema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);

      await productRequest
        .updateProduct(values)
        .then((response: any) => {
          closeModal('modal_close-formikUpdateproduct');
          setSubmitting(false);
          setLoading(false);
          getProducts();
          formikUpdateproduct.resetForm();
        })
        .catch((error: any) => {
          handleHttpError(error);
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToChange = (data: ProductModel | any) => {
    formikUpdateproduct.setValues(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectToDelete = (data: ProductModel | any) => {
    settoDeleteValue(data);
  };

  const getProducts = async () => {
    setproductloader(true);

    await productRequest
      .getProductList()
      .then((response: any) => {
        setproductDatas(response.data.items);
        setproductloader(false);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getComplaintTypeList = async () => {
    await complaintTypeRequest
      .getComplaintTypeList()
      .then((response: any) => {
        setcomplainTypeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  const getInssuranceTypeList = async () => {
    await insurranceTypeRequest
      .getInsurranceTypeList()
      .then((response: any) => {
        setinsurranceTypeDatas(response.data.items);
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteproduct = async () => {
    setproductDeleteloader(true);

    await productRequest
      .deleteProduct(toDeleteValue?.id)
      .then((response: any) => {
        getProducts();
        setproductDeleteloader(false);
        closeModal('modal_close-delete');
      })
      .catch((error: any) => {
        handleHttpError(error);
      });
  };

  useEffect(() => {
    getComplaintTypeList();
    getInssuranceTypeList();
    getProducts();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'SETTINGS.PRODUCT' })}
      </PageTitle>

      {/* Add New product modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_1">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'PRODUCT.PRODUCT_ADDING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formik"
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
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.LIBELLE' })}
                    {...formik.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.libelle && formik.errors.libelle,
                      },
                      {
                        'is-valid':
                          formik.touched.libelle && !formik.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formik.touched.libelle && formik.errors.libelle && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.libelle}</span>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.type_id && formik.errors.type_id,
                      },
                      {
                        'is-valid':
                          formik.touched.type_id && !formik.errors.type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('type_id')}
                  >
                    <option>
                      Veuillez selectionner le type de réclammation
                    </option>

                    {complainTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.type_id && formik.errors.type_id && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.type_id}</span>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'SETTINGS.INSURRANCE_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formik.touched.insurance_type_id &&
                          formik.errors.insurance_type_id,
                      },
                      {
                        'is-valid':
                          formik.touched.insurance_type_id &&
                          !formik.errors.insurance_type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formik.getFieldProps('insurance_type_id')}
                  >
                    <option>Veuillez selectionner le type d'assurance</option>

                    {insurranceTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formik.touched.insurance_type_id &&
                    formik.errors.insurance_type_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formik.errors.insurance_type_id}
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
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {loading && (
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

      {/* updating product modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog">
          <form
            className="form w-100"
            onSubmit={formikUpdateproduct.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'PRODUCT.PRODUCT_UPDATING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-formikUpdateproduct"
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
                    {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                  </label>
                  <input
                    placeholder={intl.formatMessage({ id: 'GEN.LIBELLE' })}
                    {...formikUpdateproduct.getFieldProps('libelle')}
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateproduct.touched.libelle &&
                          formikUpdateproduct.errors.libelle,
                      },
                      {
                        'is-valid':
                          formikUpdateproduct.touched.libelle &&
                          !formikUpdateproduct.errors.libelle,
                      },
                    )}
                    type="text"
                    name="libelle"
                    autoComplete="on"
                  />
                  {formikUpdateproduct.touched.libelle &&
                    formikUpdateproduct.errors.libelle && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateproduct.errors.libelle}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateproduct.touched.type_id &&
                          formikUpdateproduct.errors.type_id,
                      },
                      {
                        'is-valid':
                          formikUpdateproduct.touched.type_id &&
                          !formikUpdateproduct.errors.type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateproduct.getFieldProps('type_id')}
                  >
                    <option>
                      Veuillez selectionner le type de réclammation
                    </option>

                    {complainTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateproduct.touched.type_id &&
                    formikUpdateproduct.errors.type_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateproduct.errors.type_id}
                        </span>
                      </div>
                    )}
                </div>

                <div className="fv-row mb-8">
                  <label className="form-label fs-6 fw-bolder text-gray-900">
                    {intl.formatMessage({ id: 'SETTINGS.INSURRANCE_TYPE' })}
                  </label>

                  <select
                    className={clsx(
                      'form-control bg-transparent',
                      {
                        'is-invalid':
                          formikUpdateproduct.touched.insurance_type_id &&
                          formikUpdateproduct.errors.insurance_type_id,
                      },
                      {
                        'is-valid':
                          formikUpdateproduct.touched.insurance_type_id &&
                          !formikUpdateproduct.errors.insurance_type_id,
                      },
                    )}
                    data-control="select2"
                    data-placeholder="Latest"
                    data-hide-search="true"
                    {...formikUpdateproduct.getFieldProps('insurance_type_id')}
                  >
                    <option>Veuillez selectionner le type d'assurance</option>

                    {insurranceTypeDatas?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.libelle}
                      </option>
                    ))}
                  </select>

                  {formikUpdateproduct.touched.insurance_type_id &&
                    formikUpdateproduct.errors.insurance_type_id && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {formikUpdateproduct.errors.insurance_type_id}
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
                    formikUpdateproduct.isSubmitting ||
                    !formikUpdateproduct.isValid
                  }
                >
                  {!loading && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}
                    </span>
                  )}
                  {loading && (
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

      {/* delete product modal */}
      <div className="modal fade" tabIndex={-1} id="kt_modal_3">
        <div className="modal-dialog">
          <form className="form w-100" noValidate id="kt_login_signin_form">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {intl.formatMessage({ id: 'PRODUCT.PRODUCT_DELETING' })}
                </h5>
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  id="modal_close-delete"
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
                  <h3 className="fw-bolder text-center col-12 mv-2rem">
                    {intl.formatMessage({
                      id: 'PRODUCT.PRODUCT_WOULD_YOU_WANNA_DELETE',
                    })}{' '}
                    :{' '}
                    <span className="text-danger">
                      {toDeleteValue?.libelle}{' '}
                    </span>
                  </h3>
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

                <a
                  type="submit"
                  className="btn btn-danger"
                  onClick={() => deleteproduct()}
                >
                  {!productDeleteloader && (
                    <span className="indicator-label">
                      {intl.formatMessage({ id: 'PRODUCT.PRODUCT_DELETE' })}
                    </span>
                  )}
                  {productDeleteloader && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      {intl.formatMessage({ id: 'GEN.WAIT' })}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* complaint categories list */}
      <div className="row gx-xxl-12">
        <div className="col-xxl-12">
          <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
            <div className="card-header border-0 pt-5">
              <h5 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {/* {intl.formatMessage({id: 'GEN.lIST_OF'})}
                          {intl.formatMessage({id: 'SETTINGS.COMPLAINT_CATEGORY'})} */}
                </span>
                {/* <span className='text-muted mt-1 fw-semibold fs-7'>{row.libelle}</span> */}
              </h5>

              <div className="card-toolbar">
                <ul className="nav">
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_1"
                    >
                      {intl.formatMessage({ id: 'PRODUCT.PRODUCT_ADD' })}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card-body py-3">
              <div className="">
                <div className="" id="">
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
                      <thead>
                        <tr className="border-0">
                          <th className="p-0 w-50px fw-bolder text-left">N°</th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({ id: 'GEN.LIBELLE' })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.COMPLAINT_TYPE',
                            })}
                          </th>
                          <th className="p-0 min-w-150px fw-bolder text-left">
                            {intl.formatMessage({
                              id: 'SETTINGS.INSURRANCE_TYPE',
                            })}
                          </th>
                          <th className="p-0 min-w-50px fw-bolder text-left">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {productDatas?.map((row, index) => (
                          <tr key={row.id}>
                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2">
                                <h5>#{index + 1}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.libelle}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.type_id}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <div className="symbol symbol-45px me-2 text-hover-primary">
                                <h5>{row.insurance_type_id}</h5>
                              </div>
                            </td>

                            <td className=" text-left">
                              <a
                                onClick={() => selectToChange(row)}
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_2"
                                title={intl.formatMessage({
                                  id: 'PRODUCT.PRODUCT_UPDATE',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-warning"
                              >
                                <KTIcon
                                  iconName="notepad-edit"
                                  className="fs-1"
                                />
                              </a>
                              <a
                                onClick={() => selectToDelete(row)}
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_3"
                                title={intl.formatMessage({
                                  id: 'PRODUCT.PRODUCT_DELETE',
                                })}
                                className="btn btn-sm btn-icon btn-bg-light btn-color-danger"
                              >
                                <KTIcon iconName="trash" className="fs-1" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>

                    <div className="row">
                      {productloader && productDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center col-12 mv-2rem">
                          {intl.formatMessage({ id: 'GEN.LOADING' })}
                        </h3>
                      ) : (
                        ''
                      )}

                      {!productloader && productDatas.length == 0 ? (
                        <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
                          🚫 {intl.formatMessage({ id: 'GEN.NO_DATAS' })}
                        </h3>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  {/* end::Table */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Product };
