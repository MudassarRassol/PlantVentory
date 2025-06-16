import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Plant from "@/models/plant";

export async function GET(request, { params }) {
  try {
    await connectdb();

    const plantId = params.id;

    if (!plantId) {
      return NextResponse.json({ error: "Plant ID is required" }, { status: 400 });
    }

    const plant = await Plant.findById(plantId)
      .populate("owner", "username email profilePic")
      .populate("reviews"); // You can also `.populate({ path: "reviews", populate: { path: "userId", select: "username" } })`

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json({ plant }, { status: 200 });
    
  } catch (err) {
    console.error("Error fetching plant details:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
