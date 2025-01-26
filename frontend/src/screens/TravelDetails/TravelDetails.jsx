// import { useParams, useNavigate } from "react-router-dom";
// import { useParams, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import itrip from "../../assets/images-screen/itrip.png";
import ipoint from "../../assets/images-screen/point.png";
import iligne from "../../assets/images-screen/ligne.png";
import iaircraft from "../../assets/images-screen/aircraft.png";
import itime from "../../assets/images-screen/time.png";
import istorage from "../../assets/images-screen/storage.png";
import PropTypes from "prop-types"; // Importez PropTypes

const TravelDetails = ({ travels }) => {
  const { id } = useParams();
  //   const navigate = useNavigate();

  const travel = travels.find((travel) => travel.id === parseInt(id));

  if (!travel) {
    return <p>Voyage non trouvé</p>;
  }

  return (
    <div className="container mx-auto mb-5 bg-customGrayLightOpacity ">
      <div className="w-screen h-[235px]">
        <img
          src={itrip}
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
      <div className="p-5">
        <div className="rounded-[20px] bg-white p-3 shadow-md flex flex-col mx-auto ">
          <div className="flex flex-row gap-10 pl-4 mb-2">
            <p className="">Sam, 17/08/2025</p>
          </div>
          <div className="flex flex-col bg-customGrayLightOpacity p-3 shadow-md ">
            <div className="">
              <p className="">Car no. {travel.plateNumber}</p>
            </div>
            <div className="flex flex-row justify-between">
              <div className="">
                <p className="text-customBlue text-[20px]">
                  {travel.departurePlace}
                </p>
              </div>
              <div className="">
                <p className="text-customBlue text-[20px]">
                  {travel.arrivalPlace}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="">
                <p className="">{travel.departureTime}</p>
              </div>
              <div className="flex flex-row h-full  justify-center items-center py-1">
                <img
                  src={ipoint}
                  alt="Mr Talon"
                  className="object-cover h-[16px] w-[16px]"
                />
                <img
                  src={iligne}
                  alt="Mr Talon"
                  className="h-full flex justify-center items-center "
                />
                <img
                  src={ipoint}
                  alt="Mr Talon"
                  className="object-cover h-[16px] w-[16px]"
                />
              </div>
              <div className="">
                <p className="">{travel.arrivalTime}</p>
              </div>
            </div>
          </div>
          {/* <div className=""></div> */}
          <div className="mt-4">
            <div className="">Places disponibles</div>
            <div className="flex flex-row justify-between">
              <p className="text-[14px]">04 places disponibles</p>
              <p className="text-[14px]">Disposition des sièges 2*2</p>
            </div>

            <div className="mt-4">
              <p className="">Facilité</p>
              <div className="flex flex-row gap-2">
                <img
                  src={iaircraft}
                  alt="Mr Talon"
                  className="object-cover h-[16px] w-[16px]"
                />
                <p className="text-[15px]">Sièges confort</p>
              </div>
              <div className="flex flex-row gap-2">
                <img
                  src={itime}
                  alt="Mr Talon"
                  className="object-cover h-[16px] w-[16px]"
                />
                <p className="text-[15px]">À l&apos;heure</p>
              </div>
              <div className="flex flex-row gap-2">
                <img
                  src={istorage}
                  alt="Mr Talon"
                  className="object-cover h-[16px] w-[16px]"
                />
                <p className="text-[15px]">Espace de stockage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TravelDetails.propTypes = {
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
    })
  ).isRequired,
};

export default TravelDetails;

///////////////////////////////

// import { useParams, useNavigate } from "react-router-dom";
// import itrip from "../../assets/images-screen/itrip.png";
// import PropTypes from 'prop-types'; // Importez PropTypes

// const TravelDetails = ({ travels }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const travel = travels.find((travel) => travel.id === parseInt(id));

//   if (!travel) {
//     return <p>Voyage non trouvé</p>;
//   }

//   return (
//     <div className="flex justify-center items-center mb-5">
//     <div className="bg-white rounded-[20px] p-3 shadow-md flex flex-col w-[361px]">
//       <div className="flex flex-row gap-10 pl-4">
//         <div className=" w-[80px]">
//           <p className="text-customBlue text-[23px] font-bold-[700px] ">
//             {travel.carNumber}
//           </p>
//         </div>

//         <p className="text-customGrayLightOpacityTwo text-[20px] font-bold-[600px]">
//           {travel.plateNumber}
//         </p>
//       </div>
//       <div className="flex flex-row gap-10 pl-4">
//         <div className=" w-[80px]">
//           <p className="text-[20px] font-bold-[700px] ">{travel.departureTime}</p>
//         </div>

//         <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px]">
//           {travel.departurePlace}
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
//           <p className="text-[20px] font-bold-[700px] ">{travel.arrivalTime}</p>
//         </div>

//         <div className=" transform translate-y-[-60%] ">
//           <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px] ">
//             {travel.arrivalPlace}
//           </p>
//         </div>
//       </div>
//       <div className="transform translate-x-[-4%] mb-2">
//         <hr className="w-[107%] h-[1px] bg-customGrayLight " />
//       </div>
//       <div className="flex flex-row justify-between pl-4">
//         <div className=" ">
//           <p className="text-[16px] font-bold text-customBlue ">
//             Mt : {travel.price}
//           </p>
//         </div>
//       </div>
//       <button
//         onClick={() => navigate(-1)}
//         className="mt-4 bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-[15px] flex justify-center mx-auto"
//       >
//         Retour
//       </button>
//     </div>
//   </div>
//   );
// };

// TravelDetails.propTypes = {
//     travels: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         carNumber: PropTypes.string.isRequired,
//         plateNumber: PropTypes.string.isRequired,
//         departureTime: PropTypes.string.isRequired,
//         departurePlace: PropTypes.string.isRequired,
//         arrivalTime: PropTypes.string.isRequired,
//         arrivalPlace: PropTypes.string.isRequired,
//         price: PropTypes.string.isRequired,
//         image: PropTypes.string,
//     })).isRequired,
// };

// export default TravelDetails;
