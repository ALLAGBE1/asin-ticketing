import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom'
import './index.css'
import Footer from './components/Footer';
import Home from './screens/Home/Home';
import Header from './components/Header/Header';
import Auth from './screens/Auth/Auth';


function App() {

  return (
    <>
      {/* <Header /> */}
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
    