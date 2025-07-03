import React from "react";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User} from "lucide-react";
// import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { useNavigate } from "react-router-dom";


const Header: React.FC = () => {
  const navigate = useNavigate();


  return (
    <header className="w-full shadow-md bg-[#f9fafb]">
      <div className=" mx-auto px-6 py-3 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>

        <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {/* <Avatar className="cursor-pointer border-1 border-primary h-8 w-8">
                    <AvatarImage
                      src={"/placeholder-user.png"}
                      alt={"User"}
                      className="object-cover"
                    />
                  </Avatar> */}
                  <Menu className="w-6 h-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">Actions</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin-panel")}>
                    <User className="w-4 h-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>
      <div className="h-1 w-full bg-[rgb(255,158,27)]" />
    </header>
  );
};

export default Header;
