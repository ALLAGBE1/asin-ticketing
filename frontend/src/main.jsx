import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Footer from "./components/Footer";
import Home from "./screens/Home/Home";
import Header from "./components/Header/Header";
import Auth from "./screens/Auth/Auth";
import Profile from "./screens/Profile/Profile";
import Search from "./screens/Search/Search";
import { travels } from "./constants/data";
import TravelDetails from "./screens/TravelDetails/TravelDetails";
import TravelExtraDetails from "./screens/TravelExtraDetails/TravelExtraDetails";
import TravelExtraDetailsBooking from "./screens/TravelExtraDetailsBooking/TravelExtraDetailsBooking";
import Ticket from "./screens/Ticket/Ticket";

function App() {
  const location = useLocation();

  const showHeaderFooter = !["/auth"].includes(location.pathname);

  return (
    <>
      {/* <Header /> */}
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search travels={travels} />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route
          path="/travel/:id"
          element={<TravelDetails travels={travels} />}
        />
        <Route
          path="/travel/:id/details"
          element={<TravelExtraDetails travels={travels} />}
        />
        <Route
          path="/travel/:id/detailsBooking"
          element={<TravelExtraDetailsBooking travels={travels} />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
