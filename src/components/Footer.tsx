import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f9fafb] ">
        <div className="h-1 w-full bg-[rgb(255,158,27)]" />
      <div className="mx-auto">
        {/* Top border accent */}

        <div className="mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[rgb(83,86,90)]">
          {/* Left: Brand name or logo */}
          <div className="text-center md:text-left font-semibold text-[rgb(83,86,90)]">
            LumiDisplay App
          </div>

          {/* Right: Copyright */}
          <div className="text-center md:text-right">
            &copy; {new Date().getFullYear()} LumiDisplay. All rights reserved.
          </div>
        </div>
      </div>
      <Separator className="bg-[rgb(136,139,141)]" />
    </footer>
  );
};

export default Footer;
