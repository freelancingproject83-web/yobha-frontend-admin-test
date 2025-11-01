import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminFooter from "../admin-footer/admin-footer";
import Sidebar from "../sidebar/sidebar";
import logoImage from "../../assets/YOBHA_logo_final.png";

const AppLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-premium-cream lg:flex lg:overflow-hidden"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 lg:overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-premium-cream/95 backdrop-blur-sm border-b border-gray-200">
          <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <Link to="/products" className="flex items-center gap-2">
              <img src={logoImage} alt="YOBHA" className="h-7" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-premium-cream overflow-visible lg:overflow-auto">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AppLayout;