import dbConnection from "@/app/config/connectDB";
import users from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await dbConnection();

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

        // Hash the password using bcrypt
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPassword = password;

        // Save the user to the database
        const newUser = new users({
            username,
            email,
            password: hashedPassword, // Store the hashed password
        });

        await newUser.save();

        return new NextResponse(
            JSON.stringify({ message: "Success" }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Error adding user request:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
