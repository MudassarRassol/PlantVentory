import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Plant from "@/models/plant";
import { UploadImage } from "@/lib/uploadimg";

export async function PUT(request, { params }) {
  await connectdb();

  try {
    const plantId = params.id;
    const userId = request.headers.get("userid");

    if (!plantId || !userId) {
      return NextResponse.json({ error: "Plant ID or User ID missing" }, { status: 400 });
    }

    const plant = await Plant.findById(plantId);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }


    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const image = formData.get("image");


    let updatedFields = {};

    if (name) updatedFields.name = name;
    if (category) updatedFields.name = category;
    if (description) updatedFields.description = description;
    if (price) updatedFields.price = parseFloat(price);
    if (stock) updatedFields.stock = parseInt(stock);

    if (image && typeof image === "object") {
      const imageUrl = await UploadImage(image, "plant");
      updatedFields.image = imageUrl;
    }

    const updatedPlant = await Plant.findByIdAndUpdate(plantId, updatedFields, {
      new: true,
    });

    return NextResponse.json({ message: "Plant updated", plant: updatedPlant }, { status: 200 });

  } catch (err) {
    console.error("Error updating plant:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
