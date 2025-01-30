// Search.jsx
// import React from 'react';
// import { Link } from "react-router-dom";
// import itrip from "../../assets/icones/icone-trip.svg";
import TravelCard from "../../components/TravelCard/TravelCard";
import PropTypes from 'prop-types'; // Importez PropTypes

function Search({ travels }) {
  return (
    <div className="container mx-auto py-6 bg-customGrayLightOpacity">
      <div className="flex flex-row justify-center mb-5 gap-6">
        <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
          <p className="text-customGrayLight">De</p>
          <p className="">Akassato</p>
        </div>

        <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
          <p className="text-customGrayLight">À</p>
          <p className="">Saint-Michel</p>
        </div>
      </div>

      <div className="flex flex-row justify-center mb-5 gap-6">
        <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
          Sam, 17/08/2025
        </div>
        <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
          2 places
        </div>
      </div>

      <div>
        {travels.map((travel) => (
          <TravelCard key={travel.id} travel={travel} />
        ))}
      </div>

      <div className=""></div>
    </div>
  );
}

Search.propTypes = {
    travels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        carNumber: PropTypes.string.isRequired,
        plateNumber: PropTypes.string.isRequired,
        departureTime: PropTypes.string.isRequired,
        departurePlace: PropTypes.string.isRequired,
        arrivalTime: PropTypes.string.isRequired,
        arrivalPlace: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        image: PropTypes.string,
    })).isRequired,
};


export default Search;



//////////////////////



// import { Link } from "react-router-dom";
// import itrip from "../../assets/icones/icone-trip.svg";
// import TravelCard from "../../components/TravelCard/TravelCard";

// function Search({ travels }) {
//   return (
//     <div className="container mx-auto py-6 bg-customGrayLightOpacity">
//       <div className="flex flex-row justify-center mb-5 gap-6">
//         <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
//           <p className="text-customGrayLight">From</p>
//           <p className="">Akassato</p>
//         </div>

//         <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
//           <p className="text-customGrayLight">To</p>
//           <p className="">Saint-Michel</p>
//         </div>
//       </div>

//       <div className="flex flex-row justify-center mb-5 gap-6">
//         <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
//           Sam, 17/08/2025
//         </div>
//         <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
//           2 places
//         </div>
//       </div>

//       <div>
//         {travels.map((travel) => (
//           <TravelCard key={travel.id} travel={travel} />
//         ))}
//       </div>

//       <div className=""></div>
//     </div>
//   );
// }

// export default Search;

///////////////

// import { Link } from "react-router-dom";
// import itrip from "../../assets/icones/icone-trip.svg";

// function Search() {
//   return (
//     <div className="container mx-auto py-6 bg-customGrayLightOpacity">
//       <div className="flex flex-row justify-center mb-5 gap-6">
//         <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
//           <p className="text-customGrayLight">From</p>
//           <p className="">Akassato</p>
//         </div>

//         <div className="rounded-[14px] bg-white p-6 shadow-md w-[168px]">
//           <p className="text-customGrayLight">To</p>
//           <p className="">Saint-Michel</p>
//         </div>
//       </div>

//       <div className="flex flex-row justify-center mb-5 gap-6">
//         <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
//           Sam, 17/08/2025
//         </div>
//         <div className="rounded-[17px] bg-white p-3 shadow-md w-[168px]">
//           2 places
//         </div>
//       </div>

    //   <div className="flex justify-center items-center mb-5">
    //     <div className="bg-white rounded-[20px] p-3 shadow-md flex flex-col w-[361px]">
    //       <div className="flex flex-row gap-10 pl-4">
    //         <div className=" w-[80px]">
    //           <p className="text-customBlue text-[23px] font-bold-[700px] ">
    //             CAR 3
    //           </p>
    //         </div>

    //         <p className="text-customGrayLightOpacityTwo text-[20px] font-bold-[600px]">
    //           CA123
    //         </p>
    //       </div>
    //       <div className="flex flex-row gap-10 pl-4">
    //         <div className=" w-[80px]">
    //           <p className="text-[20px] font-bold-[700px] ">07:30</p>
    //         </div>

    //         <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px]">
    //           Akassato
    //         </p>
    //       </div>
    //       <div className="flex flex-row gap-10 pl-4">
    //         <div className="w-[60px] flex justify-center">
    //           <img
    //             src={itrip}
    //             alt="Mr Talon"
    //             className="h-full flex justify-center items-center"
    //           />
    //         </div>
    //       </div>
    //       <div className="flex flex-row gap-10 pl-4">
    //         <div className=" w-[80px]">
    //           <p className="text-[20px] font-bold-[700px] ">07:50</p>
    //         </div>

    //         {/* <div className="bg-red-500 transform relative translate-y-[-90%] z-10 "> */}
    //         <div className=" transform translate-y-[-60%] ">
    //           <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px] ">
    //             Saint-Michel
    //           </p>
    //         </div>
    //       </div>
    //       <div className="transform translate-x-[-4%] mb-2">
    //         <hr className="w-[107%] h-[1px] bg-customGrayLight " />
    //       </div>
    //       <div className="flex flex-row justify-between pl-4">
    //         <div className=" ">
    //           <p className="text-[16px] font-bold text-customBlue ">
    //             Mt : 5000 FCFA
    //           </p>
    //         </div>

    //         <Link to="/search" className="">
    //           <button
    //             type="submit"
    //             className=" bg-customBlue text-white p-2 rounded-[15px] flex justify-center mx-auto"
    //             // disabled={loading}
    //           >
    //             Book Maintenant
    //           </button>
    //         </Link>
    //       </div>
    //     </div>
    //   </div>

//       <div className="flex justify-center items-center">
//         <div className="bg-white rounded-[20px] p-3 shadow-md flex flex-col w-[361px]">
//           <div className="flex flex-row gap-10 pl-4">
//             <div className=" w-[80px]">
//               <p className="text-customBlue text-[23px] font-bold-[700px] ">
//                 CAR 4
//               </p>
//             </div>

//             <p className="text-customGrayLightOpacityTwo text-[20px] font-bold-[600px]">
//               CA985
//             </p>
//           </div>
//           <div className="flex flex-row gap-10 pl-4">
//             <div className=" w-[80px]">
//               <p className="text-[20px] font-bold-[700px] ">07:30</p>
//             </div>

//             <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px]">
//               Akassato
//             </p>
//           </div>
//           <div className="flex flex-row gap-10 pl-4">
//             <div className="w-[60px] flex justify-center">
//               <img
//                 src={itrip}
//                 alt="Mr Talon"
//                 className="h-full flex justify-center items-center"
//               />
//             </div>
//           </div>
//           <div className="flex flex-row gap-10 pl-4">
//             <div className=" w-[80px]">
//               <p className="text-[20px] font-bold-[700px] ">07:50</p>
//             </div>

//             {/* <div className="bg-red-500 transform relative translate-y-[-90%] z-10 "> */}
//             <div className=" transform translate-y-[-60%] ">
//               <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px] ">
//                 Saint-Michel
//               </p>
//             </div>
//           </div>
//           <div className="transform translate-x-[-4%] mb-2">
//             <hr className="w-[107%] h-[1px] bg-customGrayLight " />
//           </div>
//           <div className="flex flex-row justify-between pl-4">
//             <div className=" ">
//               <p className="text-[16px] font-bold text-customBlue ">
//                 Mt : 6500 FCFA
//               </p>
//             </div>

//             <Link to="/search" className="">
//               <button
//                 type="submit"
//                 className=" bg-customBlue text-white p-2 rounded-[15px] flex justify-center mx-auto"
//                 // disabled={loading}
//               >
//                 Book Maintenant
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className=""></div>
//     </div>
//   );
// }

// export default Search;
