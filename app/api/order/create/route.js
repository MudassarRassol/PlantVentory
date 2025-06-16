import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Order from "@/models/order";
import Plant from "@/models/plant";
export async function POST(request) {
  await connectdb();

  try {
    const userId = request.headers.get("userid");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const body = await request.json();
    const { items, totalAmount, shippingAddress } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing order details" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      buyer: userId,
      items,
      totalAmount,
      shippingAddress,
    });

    await newOrder.save();

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.plantId },
        update: {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));

    await Plant.bulkWrite(bulkOps);

    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
