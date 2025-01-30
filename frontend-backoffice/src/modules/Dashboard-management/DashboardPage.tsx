import { Route, Routes } from "react-router";
import { DashboardMain } from "./pages/Dashboard-main";
import { DashboardLayout } from "./DashboardLayout";

const DashboardPage = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardMain />} />
      </Route>{" "}
    </Routes>
  );
};

export { DashboardPage };
