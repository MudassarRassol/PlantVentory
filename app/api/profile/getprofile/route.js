import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import connectdb from "@/db/connectdb";
export async function GET(request) {
  await connectdb();
  try {
    const userId = request.headers.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in headers" }, { status: 400 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
