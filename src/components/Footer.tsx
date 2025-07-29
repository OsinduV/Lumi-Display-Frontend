import React from "react";
import { Lightbulb, Phone, Mail, MapPin, Award, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#53565A] to-[#888B8D] text-white">
      {/* Top accent bar with LUMIZO brand colors */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9E1B] via-[#0067A0] to-[#008C95]" />
      
      <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Brand section */}
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-lg">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Product Portal</h3>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your premier destination for professional lighting solutions. 
              Helping salespersons showcase the perfect lighting for every space.
            </p>
            <div className="flex space-x-3">
              <div className="flex items-center text-xs text-gray-300">
                <Award className="w-4 h-4 mr-1 text-[#FF9E1B]" />
                Certified Dealer
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white border-b border-[#FF9E1B] pb-2 inline-block">
              Quick Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/products" className="text-gray-300 hover:text-[#FF9E1B] transition-colors flex items-center">
                  <Zap className="w-3 h-3 mr-2" />
                  All Products
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-300 hover:text-[#008C95] transition-colors flex items-center">
                  <Lightbulb className="w-3 h-3 mr-2" />
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white border-b border-[#0067A0] pb-2 inline-block">
              Contact Info
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-[#FF9E1B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Sales Hotline</p>
                  <p className="text-xs sm:text-sm">0112 589 361</p>
                </div>
              </div>
              <div className="flex items-start text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-[#0067A0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-xs sm:text-sm">sales@lumizo.com</p>
                </div>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-[#008C95] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Showroom</p>
                  <p className="text-xs sm:text-sm">No. 244 Galle Rd, Colombo 00400</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 my-4 sm:my-6" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="font-medium text-white text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} LUMIZO Product Portal. All rights reserved.
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Professional lighting catalog for sales excellence
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-300">
            <a href="/privacy" className="hover:text-[#FF9E1B] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-[#0067A0] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/support" className="hover:text-[#008C95] transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
