import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Upload,
  ShoppingCart,
  LogOut,
  Briefcase,
  FilePlus2,
  RotateCcw,
} from "lucide-react";
import * as localStorageService from "../../service/localStorageService";

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorageService.clearAll();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Products",
      icon: Package,
      path: "/products"
    },
    {
      title: "Add Product",
      icon: Plus,
      path: "/add-product"
    },
     {
      title: "Bulk Upload Products",
      icon: ShoppingCart,
      path: "/bulk-upload",
 
    },
    {
      title: "Image Upload",
      icon: Upload,
      path: "/image-upload"
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/orders"
    },
    {
      title: "Returns",
      icon: RotateCcw,
      path: "/returns"
    },
    {
      title: "Career Jobs",
      icon: Briefcase,
      path: "/career/jobs"
    },
    {
      title: "Create Job",
      icon: FilePlus2,
      path: "/career/create"
    },
  
     {
      title: "Buyback",
      icon: ShoppingCart,
      path: "/buyback",
 
    },
   
    {
      title: "Logout",
      icon: LogOut,
      path: "/logout",
      onClick: handleLogout,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? 'w-64 lg:w-16' : 'w-64 lg:w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative top-0 left-0 min-h-screen lg:h-auto lg:min-h-full bg-white border-r border-gray-200 z-50 lg:z-auto
        transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 h-20 bg-white">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Package size={20} />
          </button>

          {!isCollapsed && (
            <div className="flex items-center">
              <img
                src={require("../../assets/YOBHA_logo_final.png")}
                alt="YOBHA Admin"
                className="h-8"
              />
            </div>
          )}
          
          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
          >
            {isCollapsed ? (
              <div className="w-4 h-4 border-r-2 border-t-2 border-current transform rotate-45"></div>
            ) : (
              <div className="w-4 h-4 border-l-2 border-b-2 border-current transform rotate-45"></div>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              
              return (
                <li key={index}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`
                        flex items-center w-full px-4 py-3 text-sm font-light transition-colors
                        ${isItemActive 
                          ? 'bg-black text-white' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center px-4 py-3 text-sm font-light transition-colors
                        ${isItemActive 
                          ? 'bg-black text-white' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      </div>
    </>
  );
};

export default Sidebar;