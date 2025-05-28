import React from "react";
import Image from "next/image";
import tree from "@/images/colour-flowers-white-pot-isolated-white.jpg";
import { Button } from "./ui/button";
import { EditIcon, EyeIcon, LucideShoppingCart } from "lucide-react";
import { Plant } from "@prisma/client";
import Link from "next/link";
const PlantCard = ({ plant }: { plant: Plant }) => {
  const role = localStorage.getItem("role");

  return (
    <>
      <div className="  h-auto rounded-3xl  border-2 p-2  transition-all duration-300 ease-linear  hover:scale-105  relative  ">
        <Image
          src={plant.imageUrl || tree}
          alt="Plant Image"
          width={500}
          height={300}
          className="rounded-3xl w-full h-[230px] sm:h-[320px] object-cover md:object-center "
        />
        <div className="flex items-center justify-between mt-2 mb-2  ">
          <span>{plant.name}</span>
          <span className="text-green-500 font-semibold">${plant.price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{plant.category}</span>
          <span className="text-gray-500 text-sm">Quantity: {plant.stock}</span>
        </div>
        {role === "seller" ? (
          <Button className="group w-full mt-2 bg-green-600 mb-1">
            Edit
            <EditIcon className=" h-4 w-4 ml-2 group-hover:animate-bounce" />
            {/* Add to Cart
          <LucideShoppingCart className=" h-4 w-4 group-hover:animate-bounce" /> */}
          </Button>
        ) : (
          <Link 
          href={`/pages/plantbyId/${plant.id}`}
          >
          <Button className=" w-full bg-green-700 mt-1 " >See Details</Button>
          </Link>
        )}
        {role === "seller" ? (
          <Link
            href={`/pages/plantbyId/${plant.id}`}
            className=" group w-8 h-8 absolute top-3 right-3  bg-green-800 hover:bg-white p-2 rounded-full flex items-center justify-center "
          >
            <EyeIcon className="h-8 w-8 text-white group-hover:text-green-800 cursor-pointer transition-all duration-300 ease-in-out z-50" />
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PlantCard;
