import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const dataToSend = {
      number: formData.phone,
      password: formData.password,
    };

    try {
      const response = await fetch(
        "https://simphat-api.vercel.app/users/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Connexion réussie :", result);

        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userNumber", result.user.number);
        localStorage.setItem("isAdmin", result.user.admin);

        if (result.user.admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        throw new Error(
          result.status ||
            "Échec de la connexion. Veuillez vérifier vos identifiants."
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-center items-center mb-5">
        <img src={logo} alt="Lolo Andoche" className="" />
      </div>

      <div className="bg-customGray p-14 rounded-[30px] shadow-md ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-6 text-customBlue">
            CONNEXION
          </h2>
          {loading && <p className="text-center mb-4">Connexion en cours...</p>}
          {errorMessage && (
            <p className="text-center text-red-500 mb-4">{errorMessage}</p>
          )}

          <label className="block mb-4">
            <span className="text-gray-700 px-5">Numéro de téléphone</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-[126px] focus:outline-none focus:ring-2 focus:ring-customBlue"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 px-5">Mot de passe</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-[126px] focus:outline-none focus:ring-2 focus:ring-customBlue"
            />
          </label>

          <button
            type="submit"
            // className="w-full bg-customBlue text-white p-2 rounded-[126px] hover:bg-blue-600 transition"
            className="w-[186px] bg-customBlue text-white p-2 rounded-[126px] flex justify-center mx-auto "
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

//////////////////////////

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo/logo.png";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(null);

//     const dataToSend = {
//       number: formData.phone,
//       password: formData.password,
//     };

//     try {
//       const response = await fetch(
//         "https://simphat-api.vercel.app/users/login/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(dataToSend),
//         }
//       );

//       const result = await response.json();

//       if (response.ok && result.success) {
//         console.log("Connexion réussie :", result);

//         localStorage.setItem("token", result.token);
//         localStorage.setItem("userName", result.user.name);
//         localStorage.setItem("userEmail", result.user.email);
//         localStorage.setItem("userNumber", result.user.number);
//         localStorage.setItem("isAdmin", result.user.admin);

//         if (result.user.admin) {
//           navigate("/admin");
//         } else {
//           navigate("/");
//         }
//       } else {
//         throw new Error(
//           result.status ||
//             "Échec de la connexion. Veuillez vérifier vos identifiants."
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       setErrorMessage("Erreur de connexion. Veuillez réessayer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* Image placée séparément du formulaire */}
//       <img src={logo} alt="Lolo Andoche" className="w-1/3 sm:w-2/6 mb-8" />

//       {/* Bloc de connexion */}
//       <div className="w-full max-w-sm ">
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-2xl font-bold text-center mb-6 text-customBlue">
//             CONNEXION
//           </h2>
//           {loading && <p className="text-center mb-4">Connexion en cours...</p>}
//           {errorMessage && (
//             <p className="text-center text-red-500 mb-4">{errorMessage}</p>
//           )}

//           <label className="block mb-4">
//             <span className="text-gray-700 px-5">Numéro</span>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 w-full border rounded-[126px] focus:outline-none focus:ring-2 focus:ring-customBlue"
//             />
//           </label>

//           <label className="block mb-6">
//             <span className="text-gray-700 px-5">Mot de passe</span>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 w-full border rounded-[126px] focus:outline-none focus:ring-2 focus:ring-customBlue"
//             />
//           </label>

//           <button
//             type="submit"
//             // className="w-full bg-customBlue text-white p-2 rounded-[126px] hover:bg-blue-600 transition"
//             className="w-[186px] bg-customBlue text-white p-2 rounded-[126px] flex justify-center mx-auto "
//             disabled={loading}
//           >
//             {loading ? "Connexion en cours..." : "Se connecter"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
