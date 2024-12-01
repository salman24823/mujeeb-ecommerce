import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnection();

    try {
        const data = await req.json(); // Parse the incoming JSON data
        const { id, Products } = data;

        // Validate the incoming data
        if (!id || !Products) {
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

        const Balance = result.balance; // Access balance as a number

        // Calculate the total bill for the purchase (assuming each product costs 5)
        const Bill = Products.length * 5;

        // Check if the user has sufficient balance
        if (Balance < Bill) {
            return new NextResponse(
                JSON.stringify({ message: "Insufficient balance" }),
                { status: 400 }
            );
        }

        // Deduct the bill amount from the user's balance
        const updatedBalance = Balance - Bill;

        // Update the user's balance in the database
        result.balance = updatedBalance;

        console.log(Products, "Products");

        // Save the updated user data to the database
        await result.save();


        return new NextResponse(
            JSON.stringify({ message: "Purchase successful" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in Purchasing:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
