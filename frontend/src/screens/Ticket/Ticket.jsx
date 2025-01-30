import { Link } from "react-router-dom";
import istopbus from "../../assets/images-screen/stopbus.png";

function Ticket() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row mt-10 mb-8">
        <div className="w-full sm:w-1/2  flex items-center justify-center mb-2">
          <img
            src={istopbus}
            alt="Mr Talon"
            className="h-full flex justify-center items-center"
          />
        </div>

        <div className="w-full sm:w-1/2 ">
          <div className="flex justify-center items-center" >
            <div className="flex flex-col justify-center items-center">
              <p className="text-[36px] font-bold-[700px] text-customBlue mb-4">
                Oops!
              </p>
              <p className="text-[24px] font-bold-[600px] text-customBlue">
                Vous n’avez pas encore de billet. <br /> Veuillez d’abord
                réserver.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Link to="/">
        <button
          type="submit"
          className="w-[218px] bg-customBlue text-white p-4 rounded-[126px] flex justify-center mx-auto mt-10 mb-8"
          // disabled={loading}
        >
          Réserver maintenant
        </button>
      </Link>
    </div>
  );
}

export default Ticket;
