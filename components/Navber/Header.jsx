
"use client"
import React, { useState } from 'react';
import logo from '@/app/assests/logo.png';
import Image from 'next/image';
import { ModeToggle } from '@/components/theme/themechanger';
import Link from 'next/link';
import { AiFillHome } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi2";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useTheme } from 'next-themes'
import { IoMenu } from "react-icons/io5";
import { Model } from 'react-model';
const Header = () => {
  const { theme, setTheme } = useTheme()
  const {menu , setMenu} = useState(false)

  function handleMenu() {
    setMenu(!menu)
  }

  return (
    <>
    <div className={` flex justify-between items-center mt-2 px-2  ${theme === "dark" ? "text-white" : " text-green-900 "} `} >
      <Image src={logo} alt="logo" width={50} height={50} />
      {/* //tabs */}
      <div className='  hidden md:visible md:flex justify-between items-center gap-4 text-lg' >
      <Link href={"/"} className=' flex justify-between items-center  hover:scale-105 transition-all duration-200 gap-1' > <AiFillHome/> Home </Link>
      <Link href={"/product"} className=' flex justify-between items-center hover:scale-105 transition-all duration-200 gap-1' > <HiShoppingBag/> Product </Link>
      <Link href={"/aboutus"} className=' flex justify-between items-center hover:scale-105 transition-all duration-200 gap-1 ' > <MdOutlineConnectWithoutContact/> 
      Contect Us </Link>
      </div>
      {/* //end tabs/ */}
      <div>
        <div className='flex justify-between items-center  ' > 
          <div className='relative ' >
             <div className=' w-3 h-3 bg-white flex justify-center items-center absolute rounded-full -top-2 right-2 text-red-600 text-[10px]  font-bold ' >
              1
             </div>
                    <FaCartShopping  className=' mr-3  ' />
          </div>
        <ModeToggle />
        <IoMenu className=' visible md:hidden text-2xl ' onClick={handleMenu} />
        </div>
      </div>
    </div>

    </>
  );
};

export default Header;