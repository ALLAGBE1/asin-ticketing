import { Route, Routes } from "react-router";
import { UsersLayout } from "./UsersLayout";
import { UsersDash } from "./pages/Users-Dash";
import { UsersClients } from "./pages/Users-Clients";
import { UsersDrivers } from "./pages/Users-Drivers";

const UsersPages = () => {
  return (
    <Routes>
      <Route element={<UsersLayout />}>
        <Route path="" element={<UsersDash />} />
        <Route path="clients" element={<UsersClients />} />
        <Route path="drivers" element={<UsersDrivers />} />
      </Route>
    </Routes>
  );
};

export { UsersPages };
