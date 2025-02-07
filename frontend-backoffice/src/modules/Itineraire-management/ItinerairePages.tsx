import { Route, Routes } from "react-router";
import { ItineraireLayout } from "./ItineraireLayout";
import { ItinerairesList } from "./pages/Itineraire-list";

const ItinerairePages = () => {
  return (
    <Routes>
      <Route element={<ItineraireLayout />}>
        <Route path="" element={<ItinerairesList />} />
        <Route path="list" element={<ItinerairesList />} />
      </Route>
    </Routes>
  );
};

export { ItinerairePages };
