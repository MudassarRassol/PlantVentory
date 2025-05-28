import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user.action";

export async function Allplants() {
  try {
    const allPlants = await prisma.plant.findMany();
    const user = await getCurrentUser();
    
    if(!allPlants){
        return {
            message : ' No PLant Yet'
        }

    }

    if (user) {
      const userId = typeof user === "string" ? user : user.id;
      return allPlants.filter(plant => plant.userId !== userId);
    }
    
    return  { success: true, userPlants : allPlants };
  } catch (error) {
    console.error("Error fetching plants:", error);
    throw new Error("Failed to fetch plants");
  }
}