// screens/TravelExtraDetails/TravelExtraDetails.jsx
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import rouleur from "../../assets/images-screen/rouleur.jpg";
import voiture from "../../assets/images-screen/voiture.jpg";
import americar from "../../assets/images-screen/americar.jpg";
import reserved from "../../assets/images-screen/reserved.png";
import available from "../../assets/images-screen/available.png";
import selected from "../../assets/images-screen/selected.png";
import PropTypes from "prop-types";
import SeatCard from "../../components/SeatCard/SeatCard";

const TravelExtraDetails = ({ travels }) => {
  const { id } = useParams();
  const travel = travels.find((travel) => travel.id === parseInt(id));

  if (!travel) {
    return <p>Voyage non trouvé</p>;
  }

  let image;

  switch (travel.image) {
    case "itrip":
      image = voiture;
      break;
    case "irouleur":
      image = rouleur;
      break;
    case "iamericar":
          image = americar;
          break;
    default:
      image = null;
      break;
  }

  return (
    <div className="container mx-auto h-[100vh]">
      <div className="h-[235px]">
        <img
          src={image}
          alt="Mr Talon"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-center transform translate-y-[-50%]">
        <div className="rounded-[20px] shadow-md flex items-center justify-center w-[209px] bg-customBlue">
          <p className="text-white text-[24px] font-bold-[700px] text-center">
            {travel.carNumber}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-3 sm:p-0">
        <div className="flex flex-row flex-wrap gap-2">
          {[...Array(travel.seat)].map((_, index) => (
            <SeatCard key={index} travel={travel} seatIndex={index} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 mt-8">
        <div className="flex flex-row ">
          <img src={reserved} alt="Mr Talon" className="w-[20px] h-[20px] " />
          <p className="">Réservé</p>
        </div>

        <div className="flex flex-row ">
          <img src={available} alt="Mr Talon" className="w-[20px] h-[20px] " />
          <p className="">Disponible</p>
        </div>

        <div className="flex flex-row ">
          <img src={selected} alt="Mr Talon" className="w-[20px] h-[20px] " />
          <p className="">Siège sélectionné</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to={`/travel/${travel.id}/detailsBooking`} className="">
          <button
            type="submit"
            className="w-[322px] h-[57px] bg-customBlue text-white p-2 rounded-[8px] flex justify-center items-center mx-auto"
          >
            Book Maintenant
          </button>
        </Link>
      </div>
    </div>
  );
};

TravelExtraDetails.propTypes = {
  travels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      carNumber: PropTypes.string.isRequired,
      plateNumber: PropTypes.string.isRequired,
      departureTime: PropTypes.string.isRequired,
      departurePlace: PropTypes.string.isRequired,
      arrivalTime: PropTypes.string.isRequired,
      arrivalPlace: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      image: PropTypes.string,
      seat: PropTypes.number.isRequired,
      seatReserved: PropTypes.number.isRequired,
      seatAvailable: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TravelExtraDetails;

////////////////////

// // screens/TravelExtraDetails/TravelExtraDetails.jsx
// import { useParams } from "react-router-dom";
// import itrip from "../../assets/images-screen/itrip.png";
// import PropTypes from "prop-types"; // Importez PropTypes
// import SeatCard from "../../components/SeatCard/SeatCard";

// const TravelExtraDetails = ({ travels }) => {
//   const { id } = useParams();
//   const travel = travels.find((travel) => travel.id === parseInt(id));

//   if (!travel) {
//     return <p>Voyage non trouvé</p>;
//   }

//   return (
//     <div className="container mx-auto mb-5 bg-customGrayLightOpacity ">
//       <div className="h-[235px]">
//         <img
//           src={itrip}
//           alt="Mr Talon"
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="flex justify-center transform translate-y-[-50%]">
//         <div className="rounded-[20px] shadow-md flex items-center justify-center w-[209px] bg-customBlue">
//           <p className="text-white text-[24px] font-bold-[700px] text-center">
//             {travel.carNumber}
//           </p>
//         </div>
//       </div>
//       {/* <div className="flex flex-col justify-center items-center p-3 sm:p-0">
//         <div className="">
//           {travels.map((travel) => (
//             <SeatCard key={travel.id} travel={travel} />
//           ))}
//         </div>
//       </div> */}
//       <div className="flex flex-col justify-center items-center p-3 sm:p-0">
//         <div className="flex flex-row flex-wrap gap-2">
//           {[...Array(travel.seat)].map((_, index) => (
//            <SeatCard key={index} travel={travel} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// TravelExtraDetails.propTypes = {
//   travels: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       carNumber: PropTypes.string.isRequired,
//       plateNumber: PropTypes.string.isRequired,
//       departureTime: PropTypes.string.isRequired,
//       departurePlace: PropTypes.string.isRequired,
//       arrivalTime: PropTypes.string.isRequired,
//       arrivalPlace: PropTypes.string.isRequired,
//       price: PropTypes.string.isRequired,
//       image: PropTypes.string,
//       seat: PropTypes.number.isRequired,
//       seatReserved: PropTypes.number.isRequired,
//       seatAvailable: PropTypes.number.isRequired,
//       seatColor: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

// export default TravelExtraDetails;

/////////////////////////

// // screens/TravelExtraDetails/TravelExtraDetails.jsx
// import { useParams } from "react-router-dom";
// import itrip from "../../assets/images-screen/itrip.png";
// import PropTypes from "prop-types"; // Importez PropTypes

// const TravelExtraDetails = ({ travels }) => {
//   const { id } = useParams();
//   const travel = travels.find((travel) => travel.id === parseInt(id));

//   if (!travel) {
//     return <p>Voyage non trouvé</p>;
//   }

//   return (
//     <div className="container mx-auto mb-5 bg-customGrayLightOpacity ">
//       <div className="h-[235px]">
//         <img
//           src={itrip}
//           alt="Mr Talon"
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="flex justify-center transform translate-y-[-50%]">
//         <div className="rounded-[20px] shadow-md flex items-center justify-center w-[209px] bg-customBlue">
//           <p className="text-white text-[24px] font-bold-[700px] text-center">
//             {travel.carNumber}
//           </p>
//         </div>
//       </div>
//       <div className="flex flex-col justify-center p-3 sm:p-0">
//         <div className="rounded-[20px] bg-white p-3 shadow-md flex flex-col mx-auto w-[361px]">
//           <div className="flex flex-col bg-customGrayLightOpacity p-3 shadow-md ">
//             <div className="pb-4">
//               <p className="text-center">Car no. {travel.plateNumber}</p>
//             </div>
//             <div className="mt-4">
//               <div className="text-[18px] font-bold-[700px]">
//                 Places disponibles
//               </div>
//               <div className="flex flex-row justify-between">
//                 <p className="text-[14px] font-bold-[600px]">
//                   04 places disponibles
//                 </p>
//                 <p className="text-[14px] font-bold-[600px]">
//                   Disposition des sièges 2*2
//                 </p>
//               </div>

//               <div className="mt-4">
//                 <p className="">Informations supplémentaires : </p>
//                 <p>Ceci est un example d&apos;informations supplémentaires </p>
//                 <p>
//                   Qui peuvent être très longue en fonction de ce que vous
//                   souhaitez afficher{" "}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// TravelExtraDetails.propTypes = {
//   travels: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       carNumber: PropTypes.string.isRequired,
//       plateNumber: PropTypes.string.isRequired,
//       departureTime: PropTypes.string.isRequired,
//       departurePlace: PropTypes.string.isRequired,
//       arrivalTime: PropTypes.string.isRequired,
//       arrivalPlace: PropTypes.string.isRequired,
//       price: PropTypes.string.isRequired,
//       image: PropTypes.string,
//     })
//   ).isRequired,
// };

// export default TravelExtraDetails;
