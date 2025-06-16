import bcrypt from "bcrypt";
import User from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  await connectdb();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }


    const token = await new SignJWT({ id: user._id.toString(), email: user.email, gardenname: user.gardenname })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 30 days
    .sign(secret);


    // Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Return success
    return NextResponse.json({ message: "Login successful", user: { email: user.email, gardenname: user.gardenname } });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
