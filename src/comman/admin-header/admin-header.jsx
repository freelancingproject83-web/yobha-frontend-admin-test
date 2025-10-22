import React from "react";
import { LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import * as localStorageService from "../../service/localStorageService";
import logoImage from "../../assets/YOBHA_logo_final.png";

const AdminHeader = ({ onMenuClick, isMobileOpen }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorageService.clearAll();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Mobile Menu Button & Logo */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="ml-4 lg:ml-0">
              <img
                src={logoImage}
                alt="YOBHA Admin"
                className="h-8 lg:h-10"
              />
            </div>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account Icon */}
            <button
              className="hidden sm:flex items-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Admin Account"
            >
              <User size={20} />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;