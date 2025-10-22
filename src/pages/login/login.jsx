import React, { useState } from "react";
import { LoginUser } from "../../service/login";
import logoImage from "../../assets/YOBHA_logo_final.png";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const payload = { email, password };
      const response = await LoginUser(payload);
      const { token, refreshToken, user } = response.data;

      // Store tokens in localStorage
      localStorage.setItem(LocalStorageKeys.AuthToken, token);
      localStorage.setItem(LocalStorageKeys.RefreshToken, refreshToken);
      localStorage.setItem(LocalStorageKeys.User, JSON.stringify(user));

      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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

          {/* Login Form */}
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-3 sm:mb-4 uppercase tracking-wider">
            Admin Login
          </h2>
          <p className="text-center text-text-medium mb-4 sm:mb-6 text-xs sm:text-sm">
            Access the YOBHA Admin Panel
          </p>

          {error && (
            <p className="text-red-500 text-center font-medium text-xs sm:text-sm">{error}</p>
          )}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleLogin}>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
                  <button
                    type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
              {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                {/* Signup Link */}
          {/* <p className="text-center text-text-medium mt-3 sm:mt-4 text-xs sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold cursor-pointer hover:text-luxury-gold transition-colors underline"
                  >
                    Sign Up
            </Link>
                </p> */}
              </div>
            </div>
          </div>
  );
};

export default LoginPage;
