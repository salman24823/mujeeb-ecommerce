import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Establish database connection
    await dbConnection();

    // Fetch all user data
    const result = await userModel.find();

    console.log("Fetched users:", result);

    // Return the data with no-cache headers to ensure fresh data
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, max-age=0", // Prevent caching
      },
    });


  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Prevent caching for errors too
        },
      }
    );
  }
}
