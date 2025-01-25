import { Route, Routes } from 'react-router-dom';
import { GestionCustomerLayout } from './GestionCustomerLayout';
import { Customer } from './pages/Customer';
import { CustomerType } from './pages/CustomerType';
import { CustomerStats } from './pages/CustomerStatistics';
import { handleUserPermissionAccess } from '../../utils/permissionAccessHandler';

const CustomerPages = () => (
  <Routes>
    <Route element={<GestionCustomerLayout />}>
      <Route
        path="list"
        element={<Customer />}
        data-permission-guard={handleUserPermissionAccess('customer:read')}
      />
      <Route
        path="types"
        element={<CustomerType />}
        data-permission-guard={handleUserPermissionAccess('customer_type:read')}
      />
      <Route
        path="stats"
        element={<CustomerStats />}
        data-permission-guard={handleUserPermissionAccess('customer:read')}
      />

      <Route index element={<Customer />} />
    </Route>
  </Routes>
);

export { CustomerPages };
