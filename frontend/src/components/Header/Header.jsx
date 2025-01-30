import logo from "../../assets/logo/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const Navbar = [
    {
      name: "Recherche",
      link: "/",
    },
    {
      name: "Ticket",
      link: "/about",
    },
    {
      name: "Profil",
      link: "/profile",
    },
  ];
  return (
    <>
      {/* <nav className="w-full h-auto bg-gray-800 lg:px-24 md:px-16 sm:px-14 px-12 py-2 shadow-md"> */}
      <nav className="w-full h-auto bg-white-800  lg:px-24 md:px-16 sm:px-14 px-12 py-2 shadow-md">
        <div className="justify-between mx-auto lg:w-full md:items-center md:flex">
          {/* Navbar logo & toggle button section */}
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              {/* Logo section */}
              <Link to="/" className="text-3xl text-orange-500 font-semibold tracking-[0.1rem]">
                {/* Navbar */}
                <img
                  src={logo}
                  alt="logo"
                  className="w-24 h-auto md:w-32 object-cover"
                />
              </Link>
              {/* Toggle button section  (we will do it later) */}
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none border border-transparent focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <FaTimes
                      className="text-gray-400 cursor-pointer"
                      size={24}
                    />
                  ) : (
                    <FaBars
                      className="text-gray-400 cursor-pointer"
                      size={24}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* NAvbar menu items section */}
          <div
            className={`flex justify-between items-center md:block ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="list-none lg:flex md:flex sm:block block gap-x-5 gap-y-16">
              {Navbar.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-gray-400 text-[1.15rem] font-medium tracking-wider hover:text-gray-200 ease-out duration-700"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* <button className="bg-orange-500 text-[1.1rem] font-normal text-white px-5 py-1.5 rounded lg:ml-10 md:ml-6 sm:ml-0 ml-0">
                Register
              </button> */}
              <Link to="/auth" className="">
                <button className="bg-customBlue text-[1.1rem] font-normal text-white px-5 py-1.5 rounded lg:ml-10 md:ml-6 sm:ml-0 ml-0">
                  Connexion
                  {/* S&apos;inscrire */}
                </button>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

// // import logo from "../../assets/logo/logo.png";
// // import barreBarre from "../../assets/header/barre-menu.svg";
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';

// export const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUserName = localStorage.getItem("userName");
//     setIsLoggedIn(!!token);
//     if (token && storedUserName) {
//       setUserName(storedUserName);
//     }
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userNumber");
//     setIsLoggedIn(false);
//     setUserName("");
//     navigate("/");
//   };

//   return (
//     <div className="bg-customGreen py-4">
//       <div className="flex flex-col md:flex-row justify-between items-center md:gap-x-4">

//         {/* Logo */}
//         <div className="flex-shrink-0">
//           {/* <img src={logo} alt="logo" className="w-24 h-auto md:w-32 object-cover" /> */}
//         </div>

//         {/* Textes */}
//         <div className="text-center md:text-left">
//           <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-bold leading-snug">
//             SALON INTERNATIONAL DE LA MÉDECINE ET DE LA PHARMACOPÉE TRADITIONNELLES
//           </h1>
//           <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-customYellow font-bold mt-2 text-center">
//             SIMPHAT 2024 <br /> <span className="text-base sm:text-lg md:text-xl lg:text-1xl xl:text-1xl">PREMIÈRE ÉDITION</span>
//           </h2>
//         </div>

//         {/* Menu */}
//         <div className="flex flex-col items-center text-white space-y-1 md:px-4 cursor-pointer" onClick={toggleMenu}>
//           {/* <img src={barreBarre} alt="MENU" className="w-6 h-auto md:w-8" /> */}
//           <p className="text-xs md:text-sm font-bold">MENU</p>
//         </div>

//       </div>

//       {/* Barre latérale (Menu latéral) */}
//       <div
//         className={`fixed top-0 right-0 w-64 h-full bg-customGreen shadow-lg transition-transform transform ${
//           isMenuOpen ? "translate-x-0" : "translate-x-full "
//         }`}
//         style={{ transitionDuration: "300ms" }}
//       >
//         {/* Bouton de fermeture "X" dans le coin supérieur droit */}
//         <div className="flex justify-end p-4">
//           <button
//             onClick={toggleMenu}
//             className="text-white font-bold text-2xl focus:outline-none"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Contenu du menu latéral */}
//         <div className="flex flex-col items-start p-4 space-y-4">
//           {isLoggedIn && (
//             <p className="text-white text-lg font-bold mb-4">{userName}</p>
//           )}
//           <Link to="/" className="hover:text-gray-200 text-white text-lg font-bold">ACCUEIL</Link>
//           <Link to="/honoraryCommittee" className="hover:text-gray-200 text-white text-lg font-bold">COMITÉ D’HONNEUR</Link>
//           {/* <Link to="/sponsors" className="hover:text-gray-200 text-white text-lg font-bold">SPONSORS</Link> */}

//           {/* Titre de section sans lien pour "ACTIVITÉS" */}
//           <h2 className="text-lg font-bold mt-4 mb-2 text-customLightGray">ACTIVITÉS</h2>

//           {/* Liens sous la section ACTIVITÉS */}
//           <Link to="/expositionVentes" className="hover:text-gray-200 text-white text-lg font-bold">EXPOSITION-VENTES</Link>
//           <Link to="/themeConferences" className="hover:text-gray-200 text-white text-lg font-bold">LES COMMUNICATIONS</Link>
//           <Link to="/programmesConferences" className="hover:text-gray-200 text-white text-lg font-bold">PROGRAMME DU SIMPHAT</Link>
//           <Link to="/dinergala" className="hover:text-gray-200 text-white text-lg font-bold">DÎNER DE GALA</Link>
//           <Link to="/participer" className="hover:text-gray-200 text-white text-lg font-bold">PARTICIPER</Link>
//           <Link to="/contact" className="hover:text-gray-200 text-white text-lg font-bold">CONTACT</Link>

//           {/* Trait séparateur */}
//           <hr className="border-t border-gray-200 w-full my-2" />

//           {/* Lien "À PROPOS DU SIMPHAT" */}
//           <Link to="/aboutus" className="hover:text-gray-200 text-white text-lg font-bold">À PROPOS DU SIMPHAT</Link>

//           {/* Lien de connexion/déconnexion */}
//           <div className="mt-auto space-y-4">
//             {isLoggedIn ? (
//               <button
//                 onClick={handleLogout}
//                 className="hover:text-gray-200 text-white text-lg font-bold"
//               >
//                 DÉCONNECTER
//               </button>
//             ) : (
//               <Link to="/auth" className="hover:text-gray-200 text-white text-lg font-bold">
//                 SE CONNECTER
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };
