import { Route, Routes } from 'react-router-dom';
import { SurveyLayout } from './SurveyLayout';
import { Satisfaction } from './pages/Satisfaction';
import { ExternalFormForNewClaim } from './pages/ExternalFormForNewClaim';

const SurveyPages = () => (
  <Routes>
    <Route element={<SurveyLayout />}>
      <Route path="satisfaction/:claim_id" element={<Satisfaction />} />
      <Route path="external/newClaim" element={<ExternalFormForNewClaim />} />
    </Route>
  </Routes>
);

export { SurveyPages };
