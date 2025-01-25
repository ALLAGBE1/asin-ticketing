/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy, FC, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MasterLayout } from '../../_metronic/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DashboardWrapper } from '../modules/dashboard/DashboardWrapper';
import { MenuTestPage } from '../modules/MenuTestPage';
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils';
import { WithChildren } from '../../_metronic/helpers';
import BuilderPageWrapper from '../modules/layout-builder/BuilderPageWrapper';

import { SettingsPages } from '../modules/gestion-paramettres/GestionParamettresPages';
import { ClaimsPages } from '../modules/gestion-reclamation/GestionReclamationPages';
import { CustomerPages } from '../modules/gestion-customer/GestionCustomerPages';
import { UsersManagementPages } from '../modules/gestion-utilisateurs/GestionUtilisateursPages';
import { GestionProfilePages } from '../modules/gestion-profile/GestionProfilePages';
import { GestionLogsPages } from '../modules/gestion-logs/GestionLogsPages';
import { GestionReportingPages } from '../modules/gestion-reporting/GestionReportingPages';
import { handleUserPermissionAccess } from '../utils/permissionAccessHandler';

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../_modules/profile/ProfilePage'));
  const WizardsPage = lazy(() => import('../_modules/wizards/WizardsPage'));
  const AccountPage = lazy(() => import('../_modules/accounts/AccountPage'));
  const WidgetsPage = lazy(() => import('../_modules/widgets/WidgetsPage'));
  const ChatPage = lazy(() => import('../_modules/apps/chat/ChatPage'));
  const UsersPage = lazy(
    () => import('../_modules/apps/user-management/UsersPage'),
  );

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="auth/*" element={<Navigate to="/dashboard" />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />

        {/* <Route path="builder" element={<BuilderPageWrapper />} />
        <Route path="menu-test" element={<MenuTestPage />} /> */}

        {/* Settings */}
        <Route path="settings/*" element={<SettingsPages />} />

        {/* Customer */}
        <Route
          path="customers/*"
          element={<CustomerPages />}
          data-permission-guard={handleUserPermissionAccess('customer:read')}
        />

        {/* Claims */}
        <Route
          path="claims/*"
          element={<ClaimsPages />}
          data-permission-guard={handleUserPermissionAccess('claims:read')}
        />

        {/* Users */}
        <Route path="users/*" element={<UsersManagementPages />} />

        {/* profile */}
        <Route path="profile/*" element={<GestionProfilePages />} />

        {/* logs */}
        <Route path="logs/*" element={<GestionLogsPages />} />

        {/* Reporting */}
        <Route
          path="reports/*"
          element={<GestionReportingPages />}
          data-permission-guard={handleUserPermissionAccess('claims:read')}
        />

        {/* Lazy Modules */}
        <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/pages/wizards/*"
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/chat/*"
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/user-management/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary');
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
