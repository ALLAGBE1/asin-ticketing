import { Route, Routes } from 'react-router-dom';
import { LogsUsers } from './pages/logs-users';
import { GestionLogsLayout } from './GestionLogsLayout';

const GestionLogsPages = () => (
  <Routes>
    <Route element={<GestionLogsLayout />}>
      <Route path="users-logs" element={<LogsUsers />} />
    </Route>
  </Routes>
);

export { GestionLogsPages };
