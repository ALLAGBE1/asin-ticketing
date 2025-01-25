import { Route, Routes } from 'react-router-dom';
import { GestionReportingLayout } from './GestionReportingLayout';
import { ReportingAnalytics } from './pages/Reporting-analytics';
import { ReportingLateTreatment } from './pages/Reporting-lateTreatment';
import { ReportingLateTreatmentBy30Days } from './pages/Reporting-lateTreatmentBy30Days';
import { handleUserPermissionAccess } from '../../utils/permissionAccessHandler';

const GestionReportingPages = () => (
  <Routes>
    <Route element={<GestionReportingLayout />}>
      <Route
        path="analytics"
        element={<ReportingAnalytics />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="late-treatment"
        element={<ReportingLateTreatment />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="late-treatment/by/30"
        element={<ReportingLateTreatmentBy30Days />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
    </Route>
  </Routes>
);

export { GestionReportingPages };
