import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-gray-50 border-t border-gray-200"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <img
              src={require("../../assets/YOBHA_logo_final.png")}
              alt="YOBHA Logo"
              className="h-8"
            />
            <p className="text-gray-600 text-sm font-light leading-relaxed max-w-sm">
              Discover the ultimate luxury in sleepwear with YOBHA. 
              Indulge in exclusivity and comfort that defines modern elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-black text-sm font-light uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 text-sm font-light hover:text-black transition-colors">Products</a>
              <a href="#" className="block text-gray-600 text-sm font-light hover:text-black transition-colors">About Us</a>
              <a href="#" className="block text-gray-600 text-sm font-light hover:text-black transition-colors">Contact</a>
              <a href="#" className="block text-gray-600 text-sm font-light hover:text-black transition-colors">Support</a>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h3 className="text-black text-sm font-light uppercase tracking-wider">Connect With Us</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-light">Email</p>
                <p className="text-black text-sm font-light">contact@yobha.com</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-light">Phone</p>
                <p className="text-black text-sm font-light">+1 (555) 123-4567</p>
              </div>
              <div className="flex space-x-4 pt-2">
                <button 
                  className="text-gray-400 hover:text-black transition-colors duration-300" 
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </button>
                <button 
                  className="text-gray-400 hover:text-black transition-colors duration-300" 
                  aria-label="Facebook"
                >
                  <FaFacebookF size={18} />
                </button>
                <button 
                  className="text-gray-400 hover:text-black transition-colors duration-300" 
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-xs font-light">
              © {new Date().getFullYear()} YOBHA. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs font-light">
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
