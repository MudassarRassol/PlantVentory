import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req) {
  try {
    const userId = req.headers.get("userid"); // ✅ User ID from middleware

    console.log("Logging out user:", userId);

    ( await cookies()).delete("token");

    return NextResponse.json({ message: "Logout successful", userId }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
