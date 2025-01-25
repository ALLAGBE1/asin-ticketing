/* eslint-disable @typescript-eslint/no-unused-vars */
import { Route, Routes } from 'react-router-dom';
import { GestionParamettresLayout } from './GestionParamettresLayout';
import { ComplaintCategory } from './pages/ComplaintCategory';
import { ComplaintObject } from './pages/ComplaintsObject';
import { ComplaintType } from './pages/__ComplaintType';
import { Currency } from './pages/Currency';
import { Institution } from './pages/Institutions';
import { InstitutionType } from './pages/InstitutionsType';
import { InsurranceType } from './pages/InsurranceType';
import { Product } from './pages/Product';
import { TreatmentDuration } from './pages/TreatmentDuration';
import { ReceivingChannel } from './pages/ReceivingChannel';
import { ResponseChannel } from './pages/ResponseChannel';
import { SeverityLevel } from './pages/SeverityLevel';
import { Status } from './pages/Status';
import { Unity } from './pages/Unity';
import { UnityType } from './pages/UnityType';
import { Level } from './pages/Level';
import { NotificationServer } from './pages/NotificationServer';
import { handleUserPermissionAccess } from '../../utils/permissionAccessHandler';
import { Agency } from './pages/Agency';

const SettingsPages = () => (
  <Routes>
    <Route element={<GestionParamettresLayout />}>
      <Route
        path="complaint-category"
        element={<ComplaintCategory />}
        data-permission-guard={handleUserPermissionAccess('category:read')}
      />
      <Route
        path="complaint-object"
        element={<ComplaintObject />}
        data-permission-guard={handleUserPermissionAccess('object:read')}
      />
      {/* <Route path="complaint-type" element={<ComplaintType />} 
        data-permission-guard={handleUserPermissionAccess('claims:read')}/> */}
      <Route
        path="currency"
        element={<Currency />}
        data-permission-guard={handleUserPermissionAccess('currency:read')}
      />
      <Route
        path="institution"
        element={<Institution />}
        data-permission-guard={handleUserPermissionAccess('institution:read')}
      />
      <Route
        path="institution-type"
        element={<InstitutionType />}
        data-permission-guard={handleUserPermissionAccess(
          'institution_type:read',
        )}
      />
      <Route
        path="insurrance-type"
        element={<InsurranceType />}
        data-permission-guard={handleUserPermissionAccess(
          'insurance_type:read',
        )}
      />
      {/* <Route path="products" element={<Product />} /> */}
      <Route
        path="prossessing-times"
        element={<TreatmentDuration />}
        data-permission-guard={handleUserPermissionAccess(
          'duration_treatment:read',
        )}
      />
      <Route
        path="receiving-channel"
        element={<ReceivingChannel />}
        data-permission-guard={handleUserPermissionAccess(
          'reception_channel:read',
        )}
      />
      <Route
        path="response-channel"
        element={<ResponseChannel />}
        data-permission-guard={handleUserPermissionAccess(
          'response_channel:read',
        )}
      />
      <Route
        path="severity-level"
        element={<SeverityLevel />}
        data-permission-guard={handleUserPermissionAccess(
          'severity_level:read',
        )}
      />
      <Route
        path="status"
        element={<Status />}
        data-permission-guard={handleUserPermissionAccess('status:read')}
      />
      <Route
        path="levels"
        element={<Level />}
        data-permission-guard={handleUserPermissionAccess('level:read')}
      />
      <Route
        path="unity"
        element={<Unity />}
        data-permission-guard={handleUserPermissionAccess('unity:read')}
      />
      <Route
        path="unity-type"
        element={<UnityType />}
        data-permission-guard={handleUserPermissionAccess('unity_type:read')}
      />
      <Route
        path="notification-server"
        element={<NotificationServer />}
        // data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="agencies"
        element={<Agency />}
        // data-permission-guard={handleUserPermissionAccess('claims:read')}
      />

      <Route index element={<ComplaintCategory />} />
    </Route>
  </Routes>
);

export { SettingsPages };
