import { useState } from "react";
// import SignUp from "./SignUp";
import Login from "./Login";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // false pour afficher connexion d'abord

  // Fonction pour basculer en mode connexion après inscription réussie
//   const onSignUpSuccess = () => {
//     setIsSignUp(false);
//   };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-customWhite">
      <div className="w-full max-w-md ">
        {isSignUp ? (
          <>
            {/* <SignUp onSignUpSuccess={onSignUpSuccess} /> */}
            <p className="text-center text-gray-600 mt-4">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={toggleAuthMode}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Connectez-vous ici
              </button>
            </p>
          </>
        ) : (
          <>
            <Login />
            <p className="text-center text-gray-600 mt-4">
              Vous n&apos;avez pas de compte ?{" "}
              <button
                onClick={toggleAuthMode}
                className="text-customBlue hover:underline focus:outline-none"
              >
                Inscrivez-vous ici
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
