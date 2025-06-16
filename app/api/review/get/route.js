import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Review from "@/models/review";


export async function GET(request) {
  await connectdb();

  try {
    const url = new URL(request.url);
    const plantId = url.searchParams.get("plantId");

    if (!plantId) {
      return NextResponse.json({ error: "Missing plantId" }, { status: 400 });
    }

    const reviews = await Review.find({ plantId })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error("Get reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
