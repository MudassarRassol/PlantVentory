import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Order from "@/models/order";

export async function GET(request) {
  await connectdb();

  try {
    const userId = request.headers.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const orders = await Order.find({ buyer: userId })
      .populate("items.plant", "name image price")
      .sort({ placedAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });

  } catch (err) {
    console.error("Fetch my orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
