"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user.action";
import { UploadImage } from "@/lib/uploadimg";

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