"use server";




import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user.action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { UploadImage } from "@/lib/uploadimg";


export async function getMyPlants(searchTerm?: string) {
  try {
    const id = await getCurrentUser();
    const userId = id?.id;
    const whereClause: any = {
      userId: userId,
    };

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    const userPlants = await prisma.plant.findMany({
      where: whereClause,
    });

    if (!userPlants || userPlants.length === 0) {
      return { success: false, message: "No plants found for this user." };
    }

    return { success: true, userPlants };
  } catch (error) {
    console.error("Error fetching plants:", error);
    throw new Error("Failed to fetch plants");
  }
}

export async function getPlantById(plantId: string) {
  try {


   

    const plant = await prisma.plant.findUnique({
      where: {
        id: plantId,
      },
    });

    if (!plant) {
      return { success: false, message: "Plant not found." };
    }

    return { success: true, plant };
  } catch (error) {
    console.error("Error fetching plant:", error);
    throw new Error("Failed to fetch plant");
  }
}

export async function CreatePlant(data: FormData) {
  try {
    console.log("Data received in CreatePlant:", data);

    const userId = await getCurrentUser();
    if (!userId) {
      return { success: false, message: "User not found." };
    }

    const img = data.get('imageUrl') as File;
    const imageUrl = await UploadImage(img, 'plants');


    // Create the plant with the uploaded image URL
    const newPlant = await prisma.plant.create({
      data: {
        name: data.get('name') as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        stock: parseInt(data.get('quantity') as string),
        category: data.get('category') as string,
        imageUrl: imageUrl as string,
        userId: typeof userId === "string" ? userId : userId.id,
      },
    });

    return { success: true, newPlant };
  } catch (error) {
    console.error("Error creating plant:", error);
    throw new Error("Failed to create plant");
  }
}
export async function EditPlant(data: FormData) {
  try {
    console.log("Data received in EditPlant:", data);

    const userId = await getCurrentUser();
    if (!userId) {
      return { success: false, message: "User not found." };
    }

    const id = data.get('id') as string;
    const existingPlant = await prisma.plant.findUnique({
      where: { id },
    });

    if (!existingPlant) {
      return { success: false, message: "Plant not found." };
    }

    // Check if user owns the plant
    if ((typeof userId === "string" ? userId : userId.id) !== existingPlant.userId) {
      return {
        success: false,
        message: "You do not have permission to edit this plant.",
      };
    }

    let imageUrl = existingPlant.imageUrl;
    const newImage = data.get('image') as File;

    // Only upload new image if one was provided
    if (newImage && newImage.size > 0) {
      imageUrl = await UploadImage(newImage, 'plants') as string;
    } else if (data.get('originalImageUrl')) {
      // Keep the original image if no new image was uploaded
      imageUrl = data.get('originalImageUrl') as string;
    }

    // Update the plant with the new data
    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        name: data.get('name') as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        stock: parseInt(data.get('stock') as string),
        category: data.get('category') as string,
        imageUrl,
        userId: typeof userId === "string" ? userId : userId.id,
      },
    });

    return { success: true, updatedPlant };
  } catch (error) {
    console.error("Error updating plant:", error);
    throw new Error("Failed to update plant");
  }
}

export async function DeletePlant(id: string) {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return { success: false, message: "User not found." };
    }
    const existingPlant = await prisma.plant.findUnique({
      where: { id: id },
    });

    if (!existingPlant) {
      return { success: false, message: "Plant not found." };
    }

    if ((typeof userId === "string" ? userId : userId.id) !== existingPlant.userId) {
      return {
        success: false,
        message: "You do not have permission to Delet this plant.",
      };
    }

    const deletedPlant = await prisma.plant.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/plants");
    return { success: true, deletedPlant };
  } catch (error) {
    console.error("Error deleting plant:", error);
    throw new Error("Failed to delete plant");
  }
}
