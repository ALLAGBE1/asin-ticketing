// SeatCard.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const SeatCard = ({ travel, seatIndex }) => {
  const isReserved = seatIndex < travel.seatReserved;
  const isAvailable =
    seatIndex >= travel.seatReserved &&
    seatIndex < travel.seatReserved + travel.seatAvailable;
  const [isSelected, setIsSelected] = useState(false);

  let seatStatusClass = "bg-customWhite";
  let seatBorderClass = ""; // Par défaut, pas de bordure
  if (isReserved) {
    seatStatusClass = "bg-customGrayLightOpacityOne";
  } else if (isSelected) {
    seatStatusClass = "bg-customBlue";
  } else if (isAvailable) {
    // Ajout de la bordure rouge si disponible
    seatBorderClass = "border-[5px] bg-customGrayLightOpacityOne"; 
  }

  const handleClick = () => {
    if (isReserved) return;
    setIsSelected(!isSelected);
  };

  return (
    <div
      className={`rounded-[10px] shadow-md w-[101px] h-[104px] cursor-pointer overflow-hidden ${seatBorderClass}`}
      onClick={handleClick}
    >
      <div className={`w-full h-full cover ${seatStatusClass}`}></div>
    </div>
  );
};

SeatCard.propTypes = {
  travel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    seat: PropTypes.number.isRequired,
    seatAvailable: PropTypes.number.isRequired,
    seatReserved: PropTypes.number.isRequired,
    carNumber: PropTypes.string.isRequired,
    plateNumber: PropTypes.string.isRequired,
    departureTime: PropTypes.string.isRequired,
    departurePlace: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    arrivalPlace: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  seatIndex: PropTypes.number.isRequired,
};

export default SeatCard;

// // SeatCard.jsx
// import PropTypes from "prop-types";
// import { useState } from "react";

// const SeatCard = ({ travel, seatIndex }) => {
//   const isReserved = seatIndex < travel.seatReserved;
//   const [isSelected, setIsSelected] = useState(false);

//   // Par défaut, on met le siège en blanc (disponible)
//   let seatStatusClass = "bg-customWhite";
//   if (isReserved) {
//     // Si le siège est réservé, on le met en gris
//     seatStatusClass = "bg-customGrayLightOpacityOne";
//   }
//   if (isSelected) {
//     // Si le siège est selectionné, on le met en rouge
//     seatStatusClass = "bg-customBlue";
//   }

//   const handleClick = () => {
//     // Si le siège est réservé, on ne fait rien.
//     if (isReserved) return;
//     // On inverse l'état du siège.
//     setIsSelected(!isSelected);
//   };

//   return (
//     <div
//       className="rounded-[10px] shadow-md w-[101px] h-[104px] cursor-pointer overflow-hidden"
//       onClick={handleClick}
//     >
//       <div className={`w-full h-full ${seatStatusClass}`}></div>
//     </div>
//   );
// };

// SeatCard.propTypes = {
//   travel: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     seat: PropTypes.number.isRequired,
//     seatAvailable: PropTypes.number.isRequired,
//     seatReserved: PropTypes.number.isRequired,
//     carNumber: PropTypes.string.isRequired,
//     plateNumber: PropTypes.string.isRequired,
//     departureTime: PropTypes.string.isRequired,
//     departurePlace: PropTypes.string.isRequired,
//     arrivalTime: PropTypes.string.isRequired,
//     arrivalPlace: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     image: PropTypes.string,
//   }).isRequired,
//   seatIndex: PropTypes.number.isRequired,
// };

// export default SeatCard;

//////////////

// // SeatCard.jsx
// import PropTypes from "prop-types";
// import { useState } from "react";

// const SeatCard = ({ travel, seatIndex }) => {
//   const isReserved = seatIndex < travel.seatReserved;
//   const [isSelected, setIsSelected] = useState(false);

//   let seatStatus = "white"; // Par défaut, on met le siège en blanc (disponible)
//   if (isReserved) {
//     seatStatus = "gray"; // Si le siège est réservé, on le met en bleu
//   }
//   if (isSelected) {
//     seatStatus = "red"; // Si le siège est selectionné, on le met en rouge
//   }

//   const handleClick = () => {
//     if (isReserved) return; // Si le siège est réservé, on ne fait rien.
//     setIsSelected(!isSelected); // On inverse l'état du siège.
//   };

//   return (
//     <div
//       className="rounded-[10px] shadow-md w-[101px] h-[104px] cursor-pointer"
//       onClick={handleClick}
//     >
//       <div className="w-full h-full" style={{ backgroundColor: seatStatus }}></div>
//     </div>
//   );
// };

// SeatCard.propTypes = {
//   travel: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     seat: PropTypes.number.isRequired,
//     seatAvailable: PropTypes.number.isRequired,
//     seatReserved: PropTypes.number.isRequired,
//     carNumber: PropTypes.string.isRequired,
//     plateNumber: PropTypes.string.isRequired,
//     departureTime: PropTypes.string.isRequired,
//     departurePlace: PropTypes.string.isRequired,
//     arrivalTime: PropTypes.string.isRequired,
//     arrivalPlace: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     image: PropTypes.string,
//   }).isRequired,
//   seatIndex: PropTypes.number.isRequired,
// };

// export default SeatCard;

// // SeatCard.jsx
// import PropTypes from "prop-types";
// import { useState } from "react";

// const SeatCard = ({ travel, seatIndex }) => {
//   const isReserved = seatIndex < travel.seatReserved;
//   const isAvailable = seatIndex >= travel.seatReserved && seatIndex < travel.seatReserved + travel.seatAvailable
//   const [isSelected, setIsSelected] = useState(false);

//   let seatStatus = "white"; // Par défaut, on met le siège en blanc (disponible)
//   if (isReserved) {
//       seatStatus = "blue"; // Si le siège est réservé, on le met en bleu
//   }
//     if (isSelected) {
//         seatStatus = "red"; // Si le siège est selectionné, on le met en rouge
//     }

//   const handleClick = () => {
//       if (isReserved) return; // Si le siège est réservé, on ne fait rien.
//       setIsSelected(!isSelected); // On inverse l'état du siège.
//   }

//   return (
//     <div
//       className="rounded-[10px] shadow-md w-[101px] h-[104px] cursor-pointer"
//         onClick={handleClick}
//     >
//       <div className="w-full h-full" style={{ backgroundColor: seatStatus }}></div>
//     </div>
//   );
// };

// SeatCard.propTypes = {
//   travel: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     seat: PropTypes.number.isRequired,
//     seatAvailable: PropTypes.number.isRequired,
//     seatReserved: PropTypes.number.isRequired,
//     carNumber: PropTypes.string.isRequired,
//     plateNumber: PropTypes.string.isRequired,
//     departureTime: PropTypes.string.isRequired,
//     departurePlace: PropTypes.string.isRequired,
//     arrivalTime: PropTypes.string.isRequired,
//     arrivalPlace: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     image: PropTypes.string,
//   }).isRequired,
//   seatIndex: PropTypes.number.isRequired,
// };

// export default SeatCard;

////////////////

// // SeatCard.jsx
// import PropTypes from "prop-types";

// const SeatCard = ({ travel }) => {
//   return (
//     <div className="rounded-[10px] shadow-md w-[101px] h-[104px]">
//       <div
//         className="w-full h-full"
//         style={{ backgroundColor: travel.seatColor }}
//       ></div>
//     </div>
//   );
// };

// const allowedColors = ["red", "green", "blue", "#FF0000", "#00FF00", "#0000FF"];

// SeatCard.propTypes = {
//   travel: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     seat: PropTypes.number.isRequired,
//     seatAvailable: PropTypes.number.isRequired,
//     seatReserved: PropTypes.number.isRequired,
//     seatColor: PropTypes.oneOf(allowedColors).isRequired,
//     carNumber: PropTypes.string.isRequired,
//     plateNumber: PropTypes.string.isRequired,
//     departureTime: PropTypes.string.isRequired,
//     departurePlace: PropTypes.string.isRequired,
//     arrivalTime: PropTypes.string.isRequired,
//     arrivalPlace: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     image: PropTypes.string,
//   }).isRequired,
// };

// export default SeatCard;

///////////////

// // SeatCard.jsx
// // import { Link } from "react-router-dom";
// // import itrip from "../../assets/icones/icone-trip.svg";
// import PropTypes from "prop-types";

// const SeatCard = ({ travel }) => {
//   return (
//     <>
//       <div className="rounded-[10px] shadow-md  w-[101px] h-[104px]">
//         <div
//           className="w-full h-full"
//           style={{ backgroundColor: travel.seatColor }}
//         ></div>
//       </div>

//       {/* <div className="flex justify-center items-center mb-5">
//         <div className="bg-white rounded-[20px] p-3 shadow-md flex flex-col w-[361px]">
//           <div className="flex flex-row gap-10 pl-4">
//             <div className=" w-[80px]">
//               <p className="text-customBlue text-[23px] font-bold-[700px] ">
//                 {travel.seatReserved}
//               </p>
//             </div>

//             <p className="text-customGrayLightOpacityTwo text-[20px] font-bold-[600px]">
//               {travel.seatAvailable}
//             </p>
//           </div>
//         </div>
//       </div> */}
//     </>
//   );
// };

// const allowedColors = ["red", "green", "blue", "#FF0000", "#00FF00", "#0000FF"];

// SeatCard.propTypes = {
//   travel: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     seat: PropTypes.number.isRequired,
//     seatAvailable: PropTypes.number.isRequired,
//     seatReserved: PropTypes.number.isRequired,
//     seatColor: PropTypes.oneOf(allowedColors).isRequired,
//     carNumber: PropTypes.string.isRequired,
//     plateNumber: PropTypes.string.isRequired,
//     departureTime: PropTypes.string.isRequired,
//     departurePlace: PropTypes.string.isRequired,
//     arrivalTime: PropTypes.string.isRequired,
//     arrivalPlace: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     image: PropTypes.string,
//   }).isRequired,
// };

// export default SeatCard;
