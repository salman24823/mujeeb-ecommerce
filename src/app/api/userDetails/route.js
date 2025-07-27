import dbConnection from "@/app/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnection();

    try {
        const data = await req.json(); // Parse the incoming JSON data
        const { id } = data;

        // Validate the incoming data
        if (!id) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Find the user in the database
        const result = await userModel.findById(id);

        if (!result) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        // Respond with a success message
        return new NextResponse(
            JSON.stringify({ message: "Fetch successful", result }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in Fetching:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
