import dbConnection from "@/config/connectDB";
import formModel from "@/models/formModel";
import { NextResponse } from "next/server";

export async function POST(req) {

    await dbConnection()

    try {
        const data = await req.json(); // Parse the incoming JSON data
        const { name, subject, message } = data;

        // Validate the incoming data
        if (!name || !message) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Save the news to the database (mocked here)
        const result = await formModel({
            name: name,
            subject: subject,
            message: message,
        });

        // save in the mongo db
        await result.save();

        return new NextResponse(JSON.stringify({message : "Success"}), { status: 201 });

    } catch (error) {
        console.error("Error submitting form :", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}