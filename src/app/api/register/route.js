import dbConnection from "@/config/connectDB";
import users from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {

    await dbConnection()

    try {
        const data = await req.json(); // Parse the incoming JSON data
        const { username, email, password } = data;

        // Validate the incoming data
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Save the news to the database (mocked here)
        const result = await users({
            username: username,
            email: email,
            password: password,
        });

        // save in the mongo db
        await result.save();

        return new NextResponse(JSON.stringify({message : "Success"}), { status: 201 });

    } catch (error) {
        console.error("Error adding user request:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}