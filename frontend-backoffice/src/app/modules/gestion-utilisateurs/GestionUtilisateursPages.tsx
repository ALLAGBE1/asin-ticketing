import { Outlet, Route, Routes } from 'react-router-dom';
import { GestionUtilisateursLayout } from './GestionUtilisateursLayout';
import { UserList } from './pages/UsersList';
import { UsersRoles } from './pages/UsersRoles';
import { UsersRoleAffectToPermissions } from './pages/UsersRoleAffectToPermissions';
import { UserDetails } from './pages/UsersDetails';
import { UserClaims } from './components/user-details/userClaims';
import { UserLogsList } from './components/user-details/userlogsList';
import { UsersRoleNew } from './pages/UsersRoles-New';
import { UsersRoleUpdate } from './pages/UsersRoles-Update';

const UsersManagementPages = () => (
  <Routes>
    <Route element={<GestionUtilisateursLayout />}>
      <Route path="list" element={<UserList />} />
      <Route path="details/:user_id" element={<UserDetails />} />

      <Route
        path="details/:user_id"
        element={
          <>
            <UserDetails />
            <Outlet />
          </>
        }
      >
        <Route path="claims" element={<UserClaims />} />
        <Route path="logs" element={<UserLogsList />} />

        <Route index element={<UserClaims />} />
      </Route>

      <Route path="roles" element={<UsersRoles />} />
      <Route path="new-role" element={<UsersRoleNew />} />
      <Route path="update-role/:role_id" element={<UsersRoleUpdate />} />
      <Route
        path="affect-role/:role_id"
        element={<UsersRoleAffectToPermissions />}
      />

      <Route index element={<UserList />} />
    </Route>
  </Routes>
);

export { UsersManagementPages };
