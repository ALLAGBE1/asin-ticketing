// TravelCard.jsx
import { Link } from "react-router-dom"; 
import itrip from "../../assets/icones/icone-trip.svg";
import PropTypes from "prop-types";

const TravelCard = ({ travel }) => {
  return (
    <div className="flex justify-center items-center mb-5">
      <div className="bg-white rounded-[20px] p-3 shadow-md flex flex-col w-[361px]">
        <div className="flex flex-row gap-10 pl-4">
          <div className=" w-[80px]">
            <p className="text-customBlue text-[23px] font-bold-[700px] ">
              {travel.carNumber}
            </p>
          </div>

          <p className="text-customGrayLightOpacityTwo text-[20px] font-bold-[600px]">
            {travel.plateNumber}
          </p>
        </div>
        <div className="flex flex-row gap-10 pl-4">
          <div className=" w-[80px]">
            <p className="text-[20px] font-bold-[700px] ">
              {travel.departureTime}
            </p>
          </div>

          <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px]">
            {travel.departurePlace}
          </p>
        </div>
        <div className="flex flex-row gap-10 pl-4">
          <div className="w-[60px] flex justify-center">
            <img
              src={itrip}
              alt="Mr Talon"
              className="h-full flex justify-center items-center"
            />
          </div>
        </div>
        <div className="flex flex-row gap-10 pl-4">
          <div className=" w-[80px]">
            <p className="text-[20px] font-bold-[700px] ">
              {travel.arrivalTime}
            </p>
          </div>

          {/* <div className="bg-red-500 transform relative translate-y-[-90%] z-10 "> */}
          <div className=" transform translate-y-[-60%] ">
            <p className="text-customGrayLightOpacityTwo text-[18px] font-bold-[600px] ">
              {travel.arrivalPlace}
            </p>
          </div>
        </div>
        <div className="transform translate-x-[-4%] mb-2">
          <hr className="w-[107%] h-[1px] bg-customGrayLight " />
        </div>
        <div className="flex flex-row justify-between pl-4">
          <div className=" ">
            <p className="text-[16px] font-bold text-customBlue ">
              Mt : {travel.price}
            </p>
          </div>

          {/* Utilisation de Link pour la navigation */}
          <Link to={`/travel/${travel.id}`} className="">
            <button
              type="submit"
              className=" bg-customBlue text-white p-2 rounded-[15px] flex justify-center mx-auto"
            >
              Book Maintenant
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

TravelCard.propTypes = {
  travel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    carNumber: PropTypes.string.isRequired,
    plateNumber: PropTypes.string.isRequired,
    departureTime: PropTypes.string.isRequired,
    departurePlace: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    arrivalPlace: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default TravelCard;
