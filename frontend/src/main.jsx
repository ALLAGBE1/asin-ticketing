import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Footer from "./components/Footer";
import Home from "./screens/Home/Home";
import Header from "./components/Header/Header";
import Auth from "./screens/Auth/Auth";
import Profile from "./screens/Profile/Profile";

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
