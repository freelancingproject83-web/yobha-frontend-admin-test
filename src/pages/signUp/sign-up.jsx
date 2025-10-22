import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../service/login";
import logoImage from "../../assets/YOBHA_logo_final.png";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({

    email: "",
    password: "",
    fullName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const signupResponse = await RegisterUser(formData);
      const { token, refreshToken, user } = signupResponse.data;

      // Store tokens in localStorage
      localStorage.setItem(LocalStorageKeys.AuthToken, token);
      localStorage.setItem(LocalStorageKeys.RefreshToken, refreshToken);
      localStorage.setItem(LocalStorageKeys.User, JSON.stringify(user));
      
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-premium-cream px-4 py-8"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="bg-premium-white border border-text-light/20 shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Logo */}
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <Link to="/" className="flex items-center">
              <img
                src={logoImage}
                alt="YOBHA Admin Logo"
                className="h-6 sm:h-8 md:h-10"
              />
            </Link>
          </div>

          {/* Signup Form */}
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-3 sm:mb-4 uppercase tracking-wider">
            Admin Signup
          </h2>
          <p className="text-center text-text-medium mb-4 sm:mb-6 text-xs sm:text-sm">
            Create your YOBHA Admin Account
          </p>

          {error && (
            <p className="text-red-500 text-center font-medium text-xs sm:text-sm">{error}</p>
          )}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-text-medium mt-3 sm:mt-4 text-xs sm:text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-semibold cursor-pointer hover:text-luxury-gold transition-colors underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;