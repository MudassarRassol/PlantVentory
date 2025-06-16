import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Order from "@/models/order";

export async function GET() {
  await connectdb();

  try {
    const orders = await Order.find()
      .populate("buyer", "username email")
      .populate("items.plant", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });

  } catch (err) {
    console.error("Fetch all orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
