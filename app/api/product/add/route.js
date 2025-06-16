import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Plant from "@/models/plant";
import { UploadImage } from "@/lib/uploadimg";

export async function POST(request) {
  await connectdb();

  try {
    const userId = request.headers.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in headers" }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const image = formData.get("image");
    const category = formData.get("category");

    if (!name || !description || !price || !stock || !image || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Upload image and get URL
    const imageurl = await UploadImage(image, 'plant');

    // Create plant document
    const newPlant = new Plant({
      name,
      description,
      image: imageurl,
      price: parseFloat(price),
      stock: parseInt(stock),
      owner: userId,
      category : category
    });

    await newPlant.save();

    return NextResponse.json({ message: "Plant added successfully", plant: newPlant }, { status: 201 });

  } catch (error) {
    console.error("Error adding plant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
