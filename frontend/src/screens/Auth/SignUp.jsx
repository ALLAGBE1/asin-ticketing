import { useState } from "react";
import PropTypes from "prop-types"; // Ajoutez cette ligne pour les PropTypes
import logo from "../../assets/logo/logo.png"; // Assurez-vous que le chemin d'accès à l'image est correct

const SignUp = ({ onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      name: formData.fullName,
      number: formData.phone,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(
        "https://simphat-api.vercel.app/users/register/",
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
        setMessage("Inscription réussie !");
        setTimeout(() => {
          onSignUpSuccess(); // Appel la fonction pour basculer sur le formulaire de connexion
        }, 1000);
      } else {
        throw new Error(
          result.message || "Une erreur s'est produite lors de l'inscription."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center py-1 mb-5">
        <img src={logo} alt="Lolo Andoche" className="" />
      </div>

      {/* Bloc d'inscription */}
      <div className="bg-customGray p-14 rounded-[30px] shadow-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-6 text-customBlue">Inscription</h2>
          {loading && <p className="text-center mb-4">Chargement...</p>}
          {message && !loading && <p className="text-center mb-4">{message}</p>}
          <label className="block mb-4">
            <span className="text-gray-700 px-5">Nom Complet</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-[126px] focus:outline-none focus:ring-2 focus:ring-customBlue"
            />
          </label>
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
          <label className="block mb-4">
            <span className="text-gray-700 px-5">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
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
            className="w-[186px] bg-customBlue text-white p-2 rounded-[126px] flex justify-center mx-auto"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  onSignUpSuccess: PropTypes.func.isRequired, // Indique que cette prop est une fonction requise
};

export default SignUp;
