'use client';
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlantCard from "./PlantCard";
import { Plant } from "@prisma/client";
import { getMyPlants } from "@/app/actions/getplant.action";
import { Skeleton } from "./ui/skeleton";

const Inventerytabel = () => {
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = localStorage.getItem('role')

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await getMyPlants();
        setPlants(response.userPlants ?? []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to load plants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []); // Removed Plant from dependencies to prevent infinite loop

  const filteredPlants = plants.filter((plant) => {
    return (
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || plant.category === category)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between w-full">
          <div className="flex gap-2 w-full">
            <Skeleton className="h-10 w-full max-w-[300px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <Skeleton className="h-10 w-[150px] mt-2 sm:mt-0" />
        </div>
        
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between w-full">
        <div className="flex gap-2 w-full">
          <Input 
            placeholder="Search Plants By Name" 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Select
            onValueChange={(value) => setCategory(value)}
            value={category}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Plants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plants</SelectItem>
                  <SelectItem value="indoor">Indoor Plants</SelectItem>
                  <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                  <SelectItem value="succulent">Succulent Plants</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="flowers">Flowering Plants</SelectItem>
                  <SelectItem value="trees">Trees</SelectItem>
                  <SelectItem value="cacti">Cacti</SelectItem>
                  <SelectItem value="ferns">Ferns</SelectItem>
                  <SelectItem value="palms">Palms</SelectItem>
                  <SelectItem value="bamboo">Bamboo</SelectItem>
                  <SelectItem value="orchids">Orchids</SelectItem>
                  <SelectItem value="carnivorous">
                    Carnivorous Plants
                  </SelectItem>
                  <SelectItem value="airplants">Air Plants</SelectItem>
              {/* Other categories... */}
            </SelectContent>
          </Select>
        </div>
        {
          role === 'seller' ?
          
        <Link href="/pages/AddPlant">
          <Button
            className="bg-green-500 text-white hover:bg-green-600 mt-2 sm:mt-0"
          >
            Add New Plant
          </Button> 
        </Link> :  ''
        }
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-2">
        {filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No plants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventerytabel;