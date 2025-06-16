import User from "@/models/user";
import { UploadImage } from "@/lib/uploadimg";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
export async function POST(request) {
  await connectdb();
  try{

    const userId = request.headers.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in headers" }, { status: 400 });
    }

    const formdata = await request.formdata();
    const image = formdata.get("image");
    const bio = formdata.get("bio");
    const username = formdata.get("username")

    const imageurl = await UploadImage(image,'plant');

    const user = await User.findByIdAndUpdate(
        {
            _id: userId,
        },
        {
            $set: {
                bio: bio,
                profilePic: imageurl,
                username: username
            },
        },
        {
            new: true,
        }
    )

    


  }
  catch(err){
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
    
}