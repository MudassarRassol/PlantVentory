import User from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req, res) {
  await connectdb();
  try {
    const { email, password, username } = await req.json();

    // 1. Validate input
    if (!email || !password || !username) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }


    const existingUser = await User.findOne({email});
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3. Create and save user
    const newUser = new User({ email, password, username , profilePic : 'https://avatar.iran.liara.run/public' });
    await newUser.save(); // This will hash the password due to pre-save hook

    // 4. Generate JWT
    const token = await new SignJWT({ id: newUser._id.toString(), email: newUser.email, username: newUser.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 30 days
    .sign(secret);


    // 5. Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // 6. Return success
    return NextResponse.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
