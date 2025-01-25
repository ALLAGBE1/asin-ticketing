/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { AuthRequests } from '../core/services/AuthRequests';

const initialValues = {
  email: 'admin@demo.com',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
});


const authRequest = new AuthRequests();

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      setTimeout(() => {
        authRequest.forgotPassword(values.email)
          .then((res:any) => {
            console.log(res)
            if(res.data.msg == "Email sent") {
              setHasErrors(false);
              setLoading(false);
            }
          })
          .catch(() => {
            setHasErrors(true);
            setLoading(false);
            setSubmitting(false);
            setStatus('The login detail is incorrect');
          });
      }, 1000);
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center mb-10">
        {/* begin::Title */}
        <h1 className="text-gray-900 fw-bolder mb-3">Mot de passe oublié ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className="text-gray-500 fw-semibold fs-6">
        Entrez votre courriel pour réinitialiser votre mot de passe.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">
            Désolé, il semble qu’il y ait des erreurs détectées, veuillez réessayer.
          </div>
        </div>
      )}

      {
        hasErrors === false ?
        <>
          <div className="mb-10 bg-light-dark p-8 rounded">
            <h4 className='text-success text-center'>
              Le lien de réinitialisation du mot de passe a été envoyé à votre adresse courriel
              <br />
              <strong className='text-dark'>-</strong>
              <br />
              The password reset link has been sent to your email address
            </h4>
          </div>
        </>
        :
        <>
          {/* begin::Form group */}
          <div className="fv-row mb-8">
            <label className="form-label fw-bolder text-gray-900 fs-6">Email</label>
            <input
              type="email"
              placeholder=""
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                },
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className="d-flex flex-wrap justify-content-center pb-lg-0">
            <button
              type="submit"
              id="kt_password_reset_submit"
              className="btn btn-primary me-4"
            >
              <span className="indicator-label">Submit</span>
              {loading && (
                <span className="indicator-progress">
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <Link to="/auth/login">
              <button
                type="button"
                id="kt_login_password_reset_form_cancel_button"
                className="btn btn-light"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>{' '}
          </div>
          {/* end::Form group */}
        </>
      }
      {/* end::Title */}

    </form>
  );
}
