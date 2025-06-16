import mongoose from "mongoose";
import Plant from "@/models/plant";
import connectdb from "@/db/connectdb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectdb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const skip = (page - 1) * limit;

    const [plants, total] = await Promise.all([
      Plant.find()
        .populate("owner", "username email profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Plant.countDocuments()
    ]);

    return NextResponse.json({
      plants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (err) {
    console.error("Fetch plants with pagination error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
