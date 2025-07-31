import dbConnection from "@/app/config/connectDB";
import { NextResponse } from "next/server";
import userModel from "@/models/userModel"
import adminModel from "@/models/adminModel";

export async function POST(req) {


    await dbConnection();

    try {
        const data = await req.json(); // Parse the incoming JSON data
        const { id, newPassword , username} = data;

        // Validate the incoming data
        if (!id || !newPassword) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Find the user in the database
        const result = await adminModel.findById(id);

        if (!result) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        // Update the password (without hashing, not recommended for production)
        result.password = newPassword; // Directly assign the new password

        // Save the updated user document
        await result.save();

        return new NextResponse(
            JSON.stringify({ message: "Password changed successfully" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in Changing:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
