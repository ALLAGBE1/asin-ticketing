import ishearch from "../../assets/images-screen/image-shearch.png";

function Home() {
  return (
    // {/* // <div className="container mx-auto h-screen grid place-items-center"> */}

    <div className="container mx-auto ">
      <div className="flex flex-col sm:flex-row ">
        <p className="lg:px-24 md:px-16 sm:px-14 px-12 py-2 ">
          Bonjour, Vous cherchez un bus ? <br /> Vous êtes au bon endroit !
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
          <div className="bg-white p-6 rounded-xl shadow-md sm:w-[500px]">
            <div className="flex items-center mb-2">
              <span className="text-xl font-semibold mr-2">📍</span>
              <p className="text-xl font-semibold">From</p>
            </div>
            <p className="text-lg mb-2">Akassato</p>
            <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
            <div className="flex items-center mb-2">
              <span className="text-xl font-semibold mr-2">◎</span>
              <p className="text-xl font-semibold">To</p>
            </div>
            <p className="text-lg mb-2">Saint-Michel</p>
            <div className="w-full border-b border-dashed border-gray-300 mb-2"></div>
            <div className="flex items-center mb-2">
              <span className="text-xl font-semibold mr-2">👥</span>
              <p className="text-xl font-semibold">Passenger</p>
            </div>
            <p className="text-lg mb-2">4 people</p>
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
    </div>
  );
}

export default Home;

