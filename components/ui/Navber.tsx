import React from "react";
import Link from "next/link";
import { Button } from "./button";
import { HomeIcon, LogIn, LogOut, Sprout } from "lucide-react";
import ModeToggle from "./Modetoggle";
import LoginCheck from "../logincheck";

const  Navbar = async () => {


  return (
    <nav className=" sticky top-0 w-full bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60 z-50  ">
      <div className="max-w-7xl mx-auto px-4 py-2  ">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="  text-xl text-primary font-bold font-mono tracking-wider"
            >
              {" "}
              🌱 PlantVentory
            </Link>
          </div>
          {/* Navigation Links */}

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/pages/plants">
                <Sprout className="w-4 h-4" />
                <span className="hidden lg:inline">Plants</span>
              </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>

            <LoginCheck />

   <ModeToggle/>
            {/* <UserButton/> */}

         
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
