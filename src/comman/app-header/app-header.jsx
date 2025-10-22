import React, { useState } from "react";
import { LogOut, Menu, X, User, Package, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import * as localStorageService from "../../service/localStorageService";
import logoImage from "../../assets/YOBHA_logo_final.png";

const HeaderWithSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorageService.clearAll();
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-premium-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4">
        {/* Logo - Left Side */}
        <Link
          to="/"
          className="flex items-center"
        >
          <img
            src={logoImage}
            alt="YOBHA Logo"
            className="h-6 sm:h-8 md:h-10"
          />
        </Link>

        {/* Desktop Nav - Center */}
        <nav className="hidden lg:flex space-x-6 xl:space-x-8 text-[14px] xl:text-[15px] font-medium">
          <Link
            to="/products"
            className="text-black hover:text-luxury-gold tracking-wide transition-colors duration-300 flex items-center gap-2"
          >
            <Package size={18} />
            Products
          </Link>
          <Link
            to="/add-product"
            className="text-black hover:text-luxury-gold tracking-wide transition-colors duration-300 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* User Account Icon - Hidden on mobile */}
          <div className="relative group hidden sm:block">
            <button
              className="text-black hover:text-luxury-gold flex items-center cursor-pointer transition-colors duration-300"
              title="Admin Account"
            >
              <User size={18} strokeWidth={1.8} />
            </button>
          </div>

          {/* Logout Icon - Hidden on mobile */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center text-black hover:text-luxury-gold transition-colors duration-300"
            title="Logout"
          >
            <LogOut size={18} strokeWidth={1.8} />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden focus:outline-none text-black hover:text-luxury-gold transition-colors duration-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative w-80 sm:w-72 bg-premium-white shadow-2xl animate-slideInLeft">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-text-light/20">
              <img
                src={logoImage}
                alt="YOBHA Logo"
                className="h-8 sm:h-10"
              />
              <button
                className="text-black hover:text-luxury-gold transition-all duration-300"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col p-4 sm:p-6 space-y-3 text-black text-sm sm:text-base">
              <Link
                to="/products"
                className="flex items-center gap-3 text-black hover:text-luxury-gold transition-colors duration-300 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <Package size={20} />
                Products
              </Link>
              <Link
                to="/add-product"
                className="flex items-center gap-3 text-black hover:text-luxury-gold transition-colors duration-300 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <Plus size={20} />
                Add Product
              </Link>

              {/* Sidebar Logout */}
              <div className="pt-4 border-t border-text-light/20 mt-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 text-black hover:text-luxury-gold transition-colors duration-300 text-left w-full font-semibold"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease forwards;
        }
      `}</style>
    </header>
  );
};

export default HeaderWithSidebar;
