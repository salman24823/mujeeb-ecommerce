import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

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
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnection(); // Ensure MongoDB is connected

    const { userId, status } = await req.json();

    if (!userId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user status
    const result = await userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true } // Returns the updated document
    );

    if (!result) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User status updated successfully", user: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}