/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { Logout, AuthPage, useAuth } from '../modules/auth';
import { App } from '../App';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { SurveyPages } from '../modules/external-pages-management/SurveyPages';
import { I18nProvider } from '../../_metronic/i18n/i18nProvider';
// import { SettingsPages } from '../pages/gestion-paramettres/GestionParamettresPages'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
// const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth();
  return (
    // <BrowserRouter basename={BASE_URL}>
    //   <Routes>
    //     <Route element={<App />}>
    //       <Route path='error/*' element={<ErrorsPage />} />
    //       <Route path='logout' element={<Logout />} />
    //       {currentUser ? (
    //         <>
    //           <Route path='/*' element={<PrivateRoutes />} />
    //           <Route index element={<Navigate to='/dashboard' />} />
    //         </>
    //       ) : (
    //         <>
    //           <Route path='auth/*' element={<AuthPage />} />
    //           <Route path='*' element={<Navigate to='/auth' />} />
    //         </>
    //       )}
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
    <Routes>
      {/* anonyme survey - pages */}
      <Route
        path="survey/*"
        element={
          <I18nProvider>
            <SurveyPages />
          </I18nProvider>
        }
      />

      <Route element={<App />}>
        <Route path="error/*" element={<ErrorsPage />} />
        <Route path="logout" element={<Logout />} />
        {currentUser ? (
          <>
            <Route path="/*" element={<PrivateRoutes />} />
            <Route index element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="auth/*" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export { AppRoutes };
