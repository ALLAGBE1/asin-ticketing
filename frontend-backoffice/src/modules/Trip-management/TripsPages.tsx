import { Route, Routes } from "react-router";
import { TripsLayout } from "./TripsLayout";
import { TripsList } from "./pages/Trips-List";

const TripsPages = () => {
  return (
    <Routes>
      <Route element={<TripsLayout />}>
        <Route path="" element={<TripsList />} />
        <Route path="list" element={<TripsList />} />
      </Route>
    </Routes>
  );
};

export { TripsPages };
