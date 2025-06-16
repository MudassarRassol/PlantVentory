import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Plant from "@/models/plant";

export async function DELETE(request, { params }) {
  await connectdb();

  try {
    const plantId = params.id;
    const userId = request.headers.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in headers" }, { status: 400 });
    }

    if (!plantId) {
      return NextResponse.json({ error: "Plant ID is required" }, { status: 400 });
    }

    const plant = await Plant.findById(plantId);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }


    await Plant.findByIdAndDelete(plantId);

    return NextResponse.json({ message: "Plant deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting plant:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
