import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom'
import './index.css'
import { Header } from './components/Header/Header';
import Footer from './components/Footer';
import Home from './screens/Home/Home';


function App() {

  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
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
