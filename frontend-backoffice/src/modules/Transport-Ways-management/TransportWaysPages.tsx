import { Route, Routes } from "react-router";
import { TransportWaysLayout } from "./TransportWaysLayout";
import { TransportWaysList } from "./pages/TransportWays-List";

const TransportWaysPages = () => {
  return (
    <Routes>
      <Route element={<TransportWaysLayout />}>
        <Route path="" element={<TransportWaysList />} />
        <Route path="list" element={<TransportWaysList />} />
      </Route>
    </Routes>
  );
};

export { TransportWaysPages };
