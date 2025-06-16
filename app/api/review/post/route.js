import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Review from "@/models/review";

export async function POST(request) {
  await connectdb();

  try {
    const userId = request.headers.get("userid");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in headers" }, { status: 400 });
    }

    const body = await request.json();
    const { plantId, rating, comment } = body;

    if (!plantId || !rating || !comment) {
      return NextResponse.json({ error: "Missing review data" }, { status: 400 });
    }

    // Optional: check if user already reviewed the same plant
    const existingReview = await Review.findOne({ userId, plantId });
    if (existingReview) {
      return NextResponse.json({ error: "You already reviewed this plant" }, { status: 409 });
    }

    const newReview = new Review({ userId, plantId, rating, comment });
    await newReview.save();

    return NextResponse.json({ message: "Review added", review: newReview }, { status: 201 });
  } catch (err) {
    console.error("Add review error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
