import { Route, Routes } from "react-router";
import { SetttingsLayout } from "./SetttingsLayout";
import { SetttingsDash } from "./pages/Setttings-Dash";
import { SetttingsStations } from "./pages/Setttings-Stations";
import { SetttingsDriversTypes } from "./pages/Setttings-DriversTypes";
import { SetttingsTransportWaysTypes } from "./pages/Setttings-TransportWaysTypes";

const SetttingsPages = () => {
  return (
    <Routes>
      <Route element={<SetttingsLayout />}>
        <Route path="" element={<SetttingsDash />} />
        <Route path="stations" element={<SetttingsStations />} />
        <Route path="driver-types" element={<SetttingsDriversTypes />} />
        <Route
          path="/transport-types"
          element={<SetttingsTransportWaysTypes />}
        />
      </Route>
    </Routes>
  );
};

export { SetttingsPages };
