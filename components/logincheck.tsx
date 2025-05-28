"use client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SignOut } from "@/app/actions/user.action";
const LoginCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const status = localStorage.getItem('login');
      setIsLoggedIn(status === 'true');
    };

    checkAuthStatus();
    
    // Add event listener for storage changes if needed
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [isLoggedIn]); // Empty dependency array to run only once

  const handleLogout = async() => {

    const res = await SignOut();
    if (res?.success === true) {
      localStorage.setItem('login', 'false');
      setIsLoggedIn(false);
      window.location.href = '/'
    } else {
      console.error("Logout failed");
    }
    // You might want to add additional logout logic here
  };

  return (
    <>
      {isLoggedIn ? (
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline">Sign-out</span>
        </Button>
      ) : (
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href="/pages/sign-in">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden lg:inline">Sign-in</span>
            </div>
          </Link>
        </Button>
      )}
    </>
  );
};

export default LoginCheck;