import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { I18nProvider } from '../_metronic/i18n/i18nProvider';
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core';
import { MasterInit } from '../_metronic/layout/MasterInit';
import { AuthInit, AuthProvider } from './modules/auth';
import { ThemeModeProvider } from '../_metronic/partials';
import { Toaster } from 'react-hot-toast';
import './App.css';
import usePermissionGuards from './usePermissionsGuard';

const App = () => {

  usePermissionGuards()

  useEffect(() => {
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <ThemeModeProvider>
              <AuthInit>
                <Outlet />
                <MasterInit />
                <Toaster position="top-right" reverseOrder={false} />
              </AuthInit>
            </ThemeModeProvider>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </AuthProvider>
  );
};

export { App };
