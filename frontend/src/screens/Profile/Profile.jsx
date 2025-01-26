import iprofile from "../../assets/images-screen/image-profile.png";

function Profile() {
  return (
    <div className="container mx-auto ">
      <div className="flex justify-center">
        <p className="text-customBlue text-[36px]">Your Information</p>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 flex sm:justify-center sm:items-center">
          <div className="flex flex-col w-fit p-6 ">
            <div className="flex flex-col justify-center items-start">
              <p className="text-[24px] font-bold">Nom Complet</p>
              <p className="text-[18px]">John</p>
            </div>

            <div className="flex flex-col justify-center items-start">
              <p className="text-[24px] font-bold">Numéro de téléphone</p>
              <p className="text-[18px]">0156521248</p>
            </div>

            <div className="flex flex-col justify-center items-start">
              <p className="text-[24px] font-bold">Email</p>
              <p className="text-[18px]">json@.com</p>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <img
            src={iprofile}
            alt="Mr Talon"
            className="h-full flex justify-center items-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
