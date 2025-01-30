import { Route, Routes } from "react-router";
import { TicketLayout } from "./TicketsLayout";
import { TicketsList } from "./pages/tickets-list";

const TicketsPage = () => {
  return (
    <Routes>
      <Route element={<TicketLayout />}>
        <Route path="" element={<TicketsList />} />
        <Route path="list" element={<TicketsList />} />
      </Route>{" "}
    </Routes>
  );
};

export { TicketsPage };
