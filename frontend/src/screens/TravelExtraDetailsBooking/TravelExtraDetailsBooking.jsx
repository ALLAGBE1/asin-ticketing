// screens/TravelExtraDetailsBooking/TravelExtraDetailsBooking.jsx
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import rouleur from "../../assets/images-screen/rouleur.jpg";
import voiture from "../../assets/images-screen/voiture.jpg";
import PropTypes from "prop-types";

const TravelExtraDetailsBooking = ({ travels }) => {
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
    default:
      image = null;
      break;
  }

  return (
    <div className="container mx-auto mb-5  ">
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
      <div className="bg-red-600 mx-auto w-[361px]"></div>

      <div className="mt-8">
        <Link to={`/travel/${travel.id}/details`} className="">
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

TravelExtraDetailsBooking.propTypes = {
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

export default TravelExtraDetailsBooking;
