import { Link } from "react-router-dom";
import ishearch from "../../assets/images-screen/image-shearch.png";
import { useState, useEffect } from "react"; // Importez useState et useEffect

function Home() {
  // État pour stocker le nom de l'utilisateur
  const [userName, setUserName] = useState("");

    useEffect(() => {
        // Récupérez le nom de l'utilisateur depuis le localStorage
        const storedName = localStorage.getItem("userName");

        // Si le nom est trouvé, mettez à jour l'état
        if (storedName) {
          setUserName(storedName);
        }
    }, []);

    return (
        <div className="container mx-auto p-5">
            <div className="flex flex-col sm:flex-row ">
              {/* Afficher le nom de l'utilisateur ou une chaine de caractères par défaut si il n'y a pas de nom */}
                <p className="text-[24px] lg:px-24 md:px-16 sm:px-14 px-12 py-2 ">
                  Bonjour {userName || " "}, Vous cherchez un bus ? <br /> Vous êtes au bon endroit !
                </p>
            </div>

            <div className="flex flex-col sm:flex-row text-base mt-10">
                <div className="w-full sm:w-1/2  flex items-center justify-center">
                    <img
                        src={ishearch}
                        alt="Mr Talon"
                        className="h-full flex justify-center items-center"
                    />
                </div>

                <div className="w-full sm:w-1/2 ">
                    <div className="bg-white p-6 rounded-[34px] shadow-md sm:w-[500px]">
                        <div className="flex items-center mb-2">
                            <span className="text-xl font-semibold mr-2">📍</span>
                            <p className="text-xl font-semibold">De</p>
                        </div>
                        <p className="text-lg mb-2">Akassato</p>
                        <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
                        <div className="flex items-center mb-2">
                            <span className="text-xl font-semibold mr-2">◎</span>
                            <p className="text-xl font-semibold">À</p>
                        </div>
                        <p className="text-lg mb-2">Saint-Michel</p>
                        <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
                        <div className="flex items-center mb-2">
                            <span className="text-xl font-semibold mr-2">👥</span>
                            <p className="text-xl font-semibold">Passagère</p>
                        </div>
                        <p className="text-lg mb-2">4 personnes</p>
                        <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <span className="text-xl font-semibold mr-2">📅</span>
                                <div>
                                    <p className="text-xl font-semibold">Date</p>
                                    <p className="text-lg">2025/2/1</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-xl font-semibold mr-2">🕒</span>
                                <div>
                                    <p className="text-xl font-semibold">Time</p>
                                    <p className="text-lg">7.30 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/search" className="">
                <button
                    type="submit"
                    className="w-[218px] bg-customBlue text-white p-4 rounded-[126px] flex justify-center mx-auto mt-10"
                >
                    Rechercher maintenant
                </button>
            </Link>
        </div>
    );
}

export default Home;


///////////

// import { Link } from "react-router-dom";
// import ishearch from "../../assets/images-screen/image-shearch.png";

// function Home() {
//   return (
//     <div className="container mx-auto p-5">
//       <div className="flex flex-col sm:flex-row ">
//         <p className="text-[24px] lg:px-24 md:px-16 sm:px-14 px-12 py-2 ">
//           Bonjour, Vous cherchez un bus ? <br /> Vous êtes au bon endroit !
//         </p>
//       </div>

//       <div className="flex flex-col sm:flex-row text-base mt-10">
//         {/* <div className="flex flex-col sm:flex-row text-base"> */}
//         <div className="w-full sm:w-1/2  flex items-center justify-center">
//           <img
//             src={ishearch}
//             alt="Mr Talon"
//             className="h-full flex justify-center items-center"
//           />
//         </div>

//         <div className="w-full sm:w-1/2 ">
//           <div className="bg-white p-6 rounded-[34px] shadow-md sm:w-[500px]">
//             <div className="flex items-center mb-2">
//               <span className="text-xl font-semibold mr-2">📍</span>
//               <p className="text-xl font-semibold">De</p>
//             </div>
//             <p className="text-lg mb-2">Akassato</p>
//             <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
//             <div className="flex items-center mb-2">
//               <span className="text-xl font-semibold mr-2">◎</span>
//               <p className="text-xl font-semibold">À</p>
//             </div>
//             <p className="text-lg mb-2">Saint-Michel</p>
//             <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
//             <div className="flex items-center mb-2">
//               <span className="text-xl font-semibold mr-2">👥</span>
//               <p className="text-xl font-semibold">Passagère</p>
//             </div>
//             <p className="text-lg mb-2">4 personnes</p>
//             <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
//             <div className="flex justify-between">
//               <div className="flex items-center">
//                 <span className="text-xl font-semibold mr-2">📅</span>
//                 <div>
//                   <p className="text-xl font-semibold">Date</p>
//                   <p className="text-lg">2025/2/1</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-xl font-semibold mr-2">🕒</span>
//                 <div>
//                   <p className="text-xl font-semibold">Time</p>
//                   <p className="text-lg">7.30 AM</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Link to="/search" className="">
//         <button
//           type="submit"
//           className="w-[218px] bg-customBlue text-white p-4 rounded-[126px] flex justify-center mx-auto mt-10"
//           // disabled={loading}
//         >
//           Rechercher maintenant
//         </button>
//       </Link>
//     </div>
//   );
// }

// export default Home;
