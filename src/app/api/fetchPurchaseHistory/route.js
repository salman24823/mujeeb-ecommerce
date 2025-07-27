import dbConnection from "@/app/config/connectDB";
import depositHistory from "@/models/depositHistory";
import { NextResponse } from "next/server";

export const revalidate = 0;


export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();

    if (data.id == "undefined") {
      return NextResponse.json(
        { message: "Missing userId field." },
        { status: 400 }
      );
    }

    const userID = data.id;

    const result = await depositHistory.find({ userID });

    console.log(result, "result");

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error("Error fetchign history:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
