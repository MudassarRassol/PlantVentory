import { NextResponse } from "next/server";
import Plant from "@/models/plant";
import connectdb from "@/db/connectdb";

export async function GET(request) {
  await connectdb();

  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;

    // Build query object dynamically
    const query = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const [plants, total] = await Promise.all([
      Plant.find(query)
        .populate("owner", "username email profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Plant.countDocuments(query),
    ]);

    return NextResponse.json({
      plants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("Error fetching plants with filters:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
