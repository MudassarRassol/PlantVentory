"use client";

import React, { useEffect, useState } from "react";
import { Plant } from "@prisma/client";
import { DeletePlant, getPlantById } from "@/app/actions/getplant.action";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf, Droplets, Sun, Sprout } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import Link from "next/link";
interface PlantDetailsProps {
  params: {
    id: string;
  };
}

const PlantDetailsPage = ({ params }: any ) => {
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [role, setrole] = useState<string | null>(null);
  useEffect(() => {
    const rol = localStorage.getItem("role");
    setrole(rol);
             const id = params.id;
    const fetchPlantDetails = async () => {
 
      try {
        setLoading(true);
        const res = await getPlantById(id);
        if (res?.plant) {
          setPlant(res.plant);
        } else {
          setError("Plant not found");
        }
      } catch (err) {
        setError("Failed to load plant details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [params.id]);

  const handleQuantityChange = (value: number) => {
    if (plant && value > 0 && value <= plant.stock) {
      setQuantity(value);
    }
  };

  const deleteplant = async (id: string) => {
    const res = await DeletePlant(id);
    if (res.success) {
      router.push("/pages/plants");
    } else {
      alert("Failed To Delete");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-6 gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Plant Image Section */}
        <div className="relative">
          {loading ? (
            <Skeleton className="h-[450px] w-full rounded-xl" />
          ) : plant?.imageUrl ? (
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-50">
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 h-[450px] rounded-xl border">
              <div className="text-center p-6">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No image available</p>
              </div>
            </div>
          )}

          {!loading && plant && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                Featured
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sprout className="w-3 h-3 text-green-500" />
                New Arrival
              </Badge>
            </div>
          )}
        </div>

        {/* Plant Details Section */}
        <div className="space-y-6">
          {loading ? (
            <>
              <Skeleton className="h-9 w-3/4" />
              <div className="flex space-x-4">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-7 w-28" />
              </div>
              <Separator className="my-4" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Separator className="my-4" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-24 w-full" />
              <Separator className="my-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
            </>
          ) : plant ? (
            <>
              <div>
                <div className=" flex items-center justify-between ">
                  <h1 className="text-3xl font-bold  tracking-tight">
                    {plant.name}
                  </h1>
                  {role === "seller" ? (
                    <Trash
                      className="text-red-500 font-bold hover:scale-105 "
                      onClick={() => deleteplant(plant.id)}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-2xl font-semibold text-green-700">
                    ${plant.price.toFixed(2)}
                  </span>
                  <Badge
                    variant={plant.stock > 0 ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {plant.stock > 0 ? (
                      <>
                        <Droplets className="w-3 h-3" />
                        {plant.stock} in stock
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium  mb-2 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Category
                </h2>
                <p className="capitalize ">
                  {plant.category.replace(/-/g, " ")}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium  mb-2">Description</h2>
                <p className="leading-relaxed">
                  {plant.description || "No description available."}
                </p>
              </div>

              <Separator />

              <div className=" flex flex-col gap-3 ">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={plant.stock <= 0 || quantity >= plant.stock}
                  >
                    +
                  </Button>
                </div>
                <Link 
                href={`${ role === 'seller' ? `/pages/updateplantbyId/${plant.id}` : ''} `}
                >
                                <Button
                  size="lg"
                  className=" w-full mt-1 "
                  disabled={plant.stock <= 0}
                  
                >
                  {
                    role === 'seller' ? "Edit Plant" : plant.stock > 0 ? "Add to Cart" : "Out of Stock"
                  }
                </Button>
                </Link>
              </div>

              <Separator />

              <div className="text-sm  space-y-1">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Added:</span>
                  {new Date(plant.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {plant.updatedAt.getTime() !== plant.createdAt.getTime() && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Updated:</span>
                    {new Date(plant.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg p-6 shadow-sm">
              <Leaf className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">Plant details not available</p>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetailsPage;
