import { Navigate, Route, Routes } from 'react-router-dom';
import { GestionReclamationLayout } from './GestionReclamationLayout';

import { Claim } from './pages/__Claim';
import { ClaimStatistics } from './pages/ClaimStatistic';

import { ClaimNew } from './pages/ClaimNew';
import { ClaimUpdate } from './pages/ClaimUpdate';
import { ClaimDetails } from './pages/ClaimDetails';

import { ClaimsIncomplete } from './pages/first-claim-flow/Step_1_ClaimsIncomplete';
import { ClaimsCompleted } from './pages/first-claim-flow/Step_2_ClaimsCompleted';
import { ClaimsToAssign } from './pages/first-claim-flow/Step_3_ClaimsToAssign';
import { ClaimsToTreat } from './pages/first-claim-flow/Step_4_ClaimsToTreat';
import { ClaimsToValid } from './pages/first-claim-flow/Step_5_ClaimsToValid';
import { ClaimsToNotify } from './pages/first-claim-flow/Step_6_ClaimsToNotify';
import { ClaimsToClose } from './pages/first-claim-flow/Step_7_ClaimsToClose';
import { ClaimsClosed } from './pages/first-claim-flow/Step_8_ClaimsClosed';

import { ClaimsMeasured } from './pages/second-claim-flow/Step_10_ClaimsMeasured';
import { ClaimsNonFounded } from './pages/first-claim-flow/Step_9_ClaimsNonFounded';
import { handleUserPermissionAccess, IsAHolding } from '../../utils/permissionAccessHandler';

const ClaimsPages = () => (
  <Routes>
    <Route element={<GestionReclamationLayout />}>
      <Route
        path="stats"
        element={<ClaimStatistics />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="claims"
        element={<Claim />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />

      <Route
        path="new"
        element={<ClaimNew />}
        data-permission-guard={handleUserPermissionAccess('claims:create') && !IsAHolding() }
      />
      <Route
        path="update/:claim_id"
        element={
          <ClaimUpdate
            data-permission-guard={handleUserPermissionAccess('claims:update')}
          />
        }
      />
      <Route
        path="details/:claim_id"
        element={<ClaimDetails />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />

      {/* first claim flow routes */}
      <Route
        path="not-complete"
        element={<ClaimsIncomplete />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="completed"
        element={<ClaimsCompleted />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="to-assign"
        element={<ClaimsToAssign />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="to-treat"
        element={<ClaimsToTreat />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="to-valid"
        element={<ClaimsToValid />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="to-notify"
        element={<ClaimsToNotify />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="to-close"
        element={<ClaimsToClose />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="closed"
        element={<ClaimsClosed />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />
      <Route
        path="not-founded"
        element={<ClaimsNonFounded />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />

      {/* second claim flow routes */}
      <Route
        path="measured"
        element={<ClaimsMeasured />}
        data-permission-guard={handleUserPermissionAccess('claims:read')}
      />

      <Route index element={<Claim />} />
      <Route path="*" element={<Navigate to="/claims/not-complete" />} />
    </Route>
  </Routes>
);

export { ClaimsPages };
