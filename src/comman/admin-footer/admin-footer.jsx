import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/YOBHA_logo_final.png";

const AdminFooter = () => {
  return (
    <footer 
      className="bg-premium-white relative z-10 border-t border-luxury-light-gold"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Brand & About */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-black tracking-wider">
             <Link 
                      to="/products" 
                      className="flex items-center"
                    >
                      <img 
                        src={logoImage} 
                        alt="YOBHA Admin Logo" 
                        className="h-6 md:h-8"
                      />
                    </Link>
            </div>
            <p className="text-text-medium text-xs leading-relaxed">
              YOBHA Admin Panel - Premium sleepwear management system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold mb-3 text-text-dark uppercase tracking-wider">
              Admin Panel
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link 
                  to="/products" 
                  className="text-text-medium hover:text-luxury-gold transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/add-product" 
                  className="text-text-medium hover:text-luxury-gold transition-colors duration-300"
                >
                  Add Product
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-light-gold bg-premium-cream">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-1">
          <div className="flex items-center justify-center text-xs text-text-medium">
            <p>© 2025 YOBHA Admin Panel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;

