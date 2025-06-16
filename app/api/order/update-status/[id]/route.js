import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Order from "@/models/order"
export async function PUT(request, { params }) {
  await connectdb();

  try {
    const orderId = params.id;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated", order: updatedOrder }, { status: 200 });

  } catch (err) {
    console.error("Update order status error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
