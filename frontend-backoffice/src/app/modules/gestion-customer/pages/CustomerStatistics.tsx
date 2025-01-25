import { FC } from 'react';
// import {useEffect, useState} from 'react'
// import {useIntl} from 'react-intl'
// import { PageTitle } from '../../../../_metronic/layout/core'
// import { KTIcon, KTSVG } from '../../../../_metronic/helpers'
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import clsx from 'clsx';

import '../GestionCustomer.css';

// const complaintTypeSchema = Yup.object().shape({
//   libelle: Yup.string()
//     .required('Libelle is required')
// })

// const complaintTypeRequest = new ComplaintTypeRequest()

const CustomerStats: FC = () => {
  // const intl = useIntl()

  // const initialValues = new ComplaintTypeModel();

  // const toUpdateValue = new ComplaintTypeModel();

  // const [toDeleteValue, settoDeleteValue] = useState(new ComplaintTypeModel());

  // const [loading, setLoading] = useState(false)
  // const [complaintTypesloader, setComplaintTypesloader] = useState(true);
  // const [complaintTypesDeleteloader, setComplaintTypesDeleteloader] = useState(false);
  // const [complaintTypesDatas, setComplaintTypesDatas] = useState(Array<ComplaintTypeModel>)

  // const formik = useFormik({
  //   initialValues,
  //   validationSchema: complaintTypeSchema,
  //   onSubmit: async (values, {setStatus, setSubmitting}) => {
  //     setLoading(true)
  //     console.log(values);

  //     try {

  //       const request = await complaintTypeRequest.addComplaintType(values);

  //       // console.log(request);

  //       if(request.status === 200) {
  //           // setLoading(false);
  //           // getComplaintTypeList();
  //           // formik.resetForm();
  //           closeModal();
  //       }

  //     } catch (error) {
  //       console.error(error)
  //       setStatus('The login details are incorrect')
  //       setSubmitting(false)
  //       setLoading(false)
  //     }
  //   },
  // })

  // const formikUpdateComplaintType = useFormik({
  //   initialValues: toUpdateValue,
  //   validationSchema: complaintTypeSchema,
  //   enableReinitialize: true,
  //   onSubmit: async (values, {setStatus, setSubmitting}) => {
  //     setLoading(true)
  //     console.log(values);
  //     try {

  //       const request = await complaintTypeRequest.updateComplaintType(values);

  //       console.log(request);

  //       if(request.status === 200) {
  //           // setLoading(false);
  //           // getComplaintTypeList();
  //           // formikUpdateComplaintType.resetForm();
  //           closeModal();
  //       }

  //     } catch (error) {
  //       console.error(error)
  //       setStatus('The login details are incorrect')
  //       setSubmitting(false)
  //       setLoading(false)
  //     }
  //   },
  // })

  // const closeModal = () => {
  //   document.getElementById('modal_close')?.click();
  //   location.reload();
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const selectToChange = (data: ComplaintTypeModel | any) => {
  //   formikUpdateComplaintType.setValues(data);
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const selectToDelete = (data: ComplaintTypeModel | any) => {
  //   settoDeleteValue(data);
  // }

  // const getComplaintTypeList = async() => {

  //   setComplaintTypesloader(true);

  //   try {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const cpm:any = await complaintTypeRequest.getComplaintTypeList();
  //       console.log(cpm.data);
  //       setComplaintTypesDatas(cpm.data.items);
  //       setComplaintTypesloader(false);
  //     } catch (error) {
  //       console.error(error);
  //   }

  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const deleteComplaintType = async() => {

  //   setComplaintTypesDeleteloader(true);

  //   try {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       //@ts-ignore
  //       const cpm = await complaintTypeRequest.deleteComplaintType(toDeleteValue.id);
  //       // console.log(cpm.data);

  //       if(cpm.status === 200) {
  //           // setComplaintTypesDeleteloader(false);
  //           getComplaintTypeList();
  //           closeModal();
  //       }

  //     } catch (error) {
  //       console.error(error);
  //   }

  // }

  // useEffect(() => {

  //   getComplaintTypeList();

  // }, []);

  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'SETTINGS.COMPLAINT_TYPE'})}</PageTitle> */}

      {/* Add New Complaint Type modal */}
      {/* <div className="modal fade" tabIndex={-1} id="kt_modal_1">
    
            <div className="modal-dialog">
     
                <form className='form w-100' onSubmit={formik.handleSubmit}
                      noValidate id='kt_login_signin_form'>
    
                    <div className="modal-content">
    
                        <div className="modal-header">
                            <h5 className="modal-title">{intl.formatMessage({id: 'COMPLAINT.TYPE_ADDING'})}</h5>
                            <div
                            className="modal_closer btn btn-icon btn-sm btn-active-light-primary ms-2"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <KTSVG
                                path="media/icons/duotune/arrows/arr061.svg"
                                className="svg-icon svg-icon-2x"
                            />
                            </div>
                        </div>
    
                        <div className="modal-body">
                                                
                                    <div className='fv-row mb-8'>
                                        <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'GEN.LIBELLE'})}</label>
                                        <input
                                        placeholder={intl.formatMessage({id: 'GEN.LIBELLE'})}
                                        {...formik.getFieldProps('libelle')}
                                        className={clsx(
                                            'form-control bg-transparent',
                                            {'is-invalid': formik.touched.libelle && formik.errors.libelle},
                                            {
                                            'is-valid': formik.touched.libelle && !formik.errors.libelle,
                                            }
                                        )}
                                        type='text'
                                        name='libelle'
                                        autoComplete='on'
                                        />
                                        {formik.touched.libelle && formik.errors.libelle && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.libelle}</span>
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
                                {intl.formatMessage({id: 'GEN.CANCEL'})}
                            </button>
    
                            <button type="submit" className="btn btn-primary"
                                disabled={formik.isSubmitting || !formik.isValid}>
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'AUTH.GENERAL.SUBMIT_BUTTON'})}</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    {intl.formatMessage({id: 'GEN.WAIT'})}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
    
                        </div>
    
                    </div>
    
                </form>
    
            </div>
    
          </div> */}

      {/* updating Complaint Type modal */}
      {/* <div className="modal fade" tabIndex={-1} id="kt_modal_2">
    
            <div className="modal-dialog">
     
                <form className='form w-100' onSubmit={formikUpdateComplaintType.handleSubmit}
                      noValidate id='kt_login_signin_form'>
    
                    <div className="modal-content">
    
                        <div className="modal-header">
                            <h5 className="modal-title">{intl.formatMessage({id: 'COMPLAINT.TYPE_UPDATING'})}</h5>
                            <div
                            className="modal_closer btn btn-icon btn-sm btn-active-light-primary ms-2"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <KTSVG
                                path="media/icons/duotune/arrows/arr061.svg"
                                className="svg-icon svg-icon-2x"
                            />
                            </div>
                        </div>
    
                        <div className="modal-body">
                                                
                                    <div className='fv-row mb-8'>
                                        <label className='form-label fs-6 fw-bolder text-gray-900'>{intl.formatMessage({id: 'GEN.LIBELLE'})}</label>
                                        <input
                                        placeholder={intl.formatMessage({id: 'GEN.LIBELLE'})}
                                        {...formikUpdateComplaintType.getFieldProps('libelle')}
                                        className={clsx(
                                            'form-control bg-transparent',
                                            {'is-invalid': formikUpdateComplaintType.touched.libelle && formikUpdateComplaintType.errors.libelle},
                                            {
                                            'is-valid': formikUpdateComplaintType.touched.libelle && !formikUpdateComplaintType.errors.libelle,
                                            }
                                        )}
                                        type='text'
                                        name='libelle'
                                        autoComplete='on'
                                        />
                                        {formikUpdateComplaintType.touched.libelle && formikUpdateComplaintType.errors.libelle && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formikUpdateComplaintType.errors.libelle}</span>
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
                                {intl.formatMessage({id: 'GEN.CANCEL'})}
                            </button>
    
                            <button type="submit" className="btn btn-primary"
                                disabled={formikUpdateComplaintType.isSubmitting || !formikUpdateComplaintType.isValid}>
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'AUTH.GENERAL.SUBMIT_BUTTON'})}</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    {intl.formatMessage({id: 'GEN.WAIT'})}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
    
                        </div>
    
                    </div>
    
                </form>
    
            </div>
    
          </div> */}

      {/* delete Complaint Type modal */}
      {/* <div className="modal fade" tabIndex={-1} id="kt_modal_3">
    
            <div className="modal-dialog">
    
                <form className='form w-100' noValidate id='kt_login_signin_form'>
    
                    <div className="modal-content">
    
                        <div className="modal-header">
                            <h5 className="modal-title">{intl.formatMessage({id: 'COMPLAINT.TYPE_DELETING'})}</h5>
                            <div
                            className="modal_closer btn btn-icon btn-sm btn-active-light-primary ms-2"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <KTSVG
                                path="media/icons/duotune/arrows/arr061.svg"
                                className="svg-icon svg-icon-2x"
                            />
                            </div>
                        </div>
    
                        <div className="modal-body">
                                                
                                    <div className='fv-row mb-8'>
                                        
                                        <h3 className='fw-bolder text-center col-12 mv-2rem'>
                                        {intl.formatMessage({id: 'COMPLAINT.TYPE_WOULD_YOU_WANNA_DELETE'})} : <span className="text-danger">{ toDeleteValue.libelle } </span> ?
                                        </h3>
    
                                    </div>
                                    
    
                        </div>
    
                        <div className="modal-footer">
    
                            <button
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                                >
                                {intl.formatMessage({id: 'GEN.CANCEL'})}
                            </button>
    
                            <button type="submit" className="btn btn-danger" onClick={() => deleteComplaintType()}>
                                {!complaintTypesDeleteloader && <span className='indicator-label'>{intl.formatMessage({id: 'COMPLAINT.TYPE_DELETE'})}</span>}
                                {complaintTypesDeleteloader && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    {intl.formatMessage({id: 'GEN.WAIT'})}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
    
                        </div>
    
                    </div>
    
                </form>
    
            </div>
    
          </div> */}

      {/* complaint Types list */}
      {/* <div className='row g-5 gx-xxl-12'>
    
            <div className='col-xxl-12'>
                
              <div className={`card card-xxl-stretch mb-5 mb-xxl-8`}>
    
                <div className='card-header border-0 pt-5'>
    
                    <h5 className='card-title align-items-start flex-column'>
                        <span className='card-label fw-bold fs-3 mb-1'>
                            {intl.formatMessage({id: 'GEN.lIST_OF'})}
                            {intl.formatMessage({id: 'SETTINGS.COMPLAINT_TYPE'})}
                        </span>
                    </h5>
                    
                    <div className='card-toolbar'>
    
                        <ul className='nav'>
                            <li className='nav-item'>
                                <button type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_1"
                                    >
                                    {intl.formatMessage({id: 'COMPLAINT.TYPE_ADD'})}
                                </button>
                            </li>
                        </ul>
    
                    </div>
    
                </div>
                
                <div className='card-body py-3'>
    
                    <div className=''>
    
                        <div className='' id=''>
    
                            <div className='table-responsive'>
    
                            <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
    
                                <thead>
                                    <tr className='border-0'>
                                        <th className='p-0 w-50px fw-bolder text-left'>N°</th>
                                        <th className='p-0 min-w-150px fw-bolder text-left'>Libelle</th>
                                        <th className='p-0 min-w-50px fw-bolder text-left'>Action</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
    
                                    {complaintTypesDatas?.map((row, index) => (
                                        
                                        <tr key={row.id}>
    
                                            <td className=' text-left'>
                                                <div className='symbol symbol-45px me-2'>
                                                    <h5>#{index + 1}</h5>
                                                </div>
                                            </td>
    
                                            <td className=' text-left'>
                                                <div className='symbol symbol-45px me-2 text-hover-primary'>
                                                    <h5>{row.libelle}</h5>
                                                </div>
                                            </td>
    
                                            <td className=' text-left'>
                                                <a  onClick={() => selectToChange(row)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#kt_modal_2"
                                                    title={intl.formatMessage({id: 'COMPLAINT.TYPE_UPDATE'})}
                                                    className='btn btn-sm btn-icon btn-bg-light btn-color-warning'
                                                >
                                                    <KTIcon iconName='notepad-edit' className='fs-1' />
                                                </a>
                                                <a
                                                    onClick={() => selectToDelete(row)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#kt_modal_3"
                                                    title={intl.formatMessage({id: 'COMPLAINT.TYPE_DELETE'})}
                                                    className='btn btn-sm btn-icon btn-bg-light btn-color-danger'
                                                >
                                                    <KTIcon iconName='trash' className='fs-1' />
                                                </a>
                                            </td>
    
                                        </tr>
    
                                    ))}
                                
                                </tbody>
    
                            </table>
                            
                            <div className='row'>
                                        
    
                                        {
                                            complaintTypesloader && complaintTypesDatas.length == 0
    
                                            ?
    
                                            <h3 className='fw-bolder text-center col-12 mv-2rem'>{intl.formatMessage({id: 'GEN.LOADING'})}</h3>
                                            
                                            :
    
                                            ''
                                        }
    
                                        {
                                            !complaintTypesloader && complaintTypesDatas.length == 0
    
                                            ?
    
                                            <h3 className='fw-bolder text-center text-danger col-12 mv-2rem'>🚫 {intl.formatMessage({id: 'GEN.NO_DATAS'})}</h3>
                                            
                                            :
    
                                            ''
                                        }
    
                                    
                            </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
              </div>
    
            </div>
    
          </div> */}
    </>
  );
};

export { CustomerStats };
