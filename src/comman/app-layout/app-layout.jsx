import React, { useState } from "react";
import AdminFooter from "../admin-footer/admin-footer";
import Sidebar from "../sidebar/sidebar";

const AppLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  console.log("AppLayout rendering...", { isCollapsed, isMobileOpen });

  return (
    <div className="h-screen bg-premium-cream flex overflow-hidden" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Main Content */}
        <main className="flex-1 bg-premium-cream overflow-auto">
          <div className="w-full max-w-none px-6 lg:px-8 py-8">
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