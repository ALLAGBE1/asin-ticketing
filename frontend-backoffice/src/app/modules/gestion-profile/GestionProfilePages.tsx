import { Route, Routes } from 'react-router-dom';
import { GestionProfileLayout } from './GestionProfileLayout';
import { ProfileInfoUpdate } from './pages/Profile-InfoUpdate';
import { ProfilePasswordUpdate } from './pages/Profile-PasswordUpdate';

const GestionProfilePages = () => (
  <Routes>
    <Route element={<GestionProfileLayout />}>
      <Route path="overview" element={<ProfileInfoUpdate />} />
      <Route path="update-password" element={<ProfilePasswordUpdate />} />

      {/* <Route index element={<ProfileInfoUpdate />} /> */}
    </Route>
  </Routes>
);

export { GestionProfilePages };
