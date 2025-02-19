import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export const revalidate = 0 ;

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json(); // Parse the incoming JSON data
    const { id, Products } = data;

    // Validate the incoming data
    if (!id || !Array.isArray(Products) || Products.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    // Find the user in the database
    const result = await userModel.findById(id);
    if (!result) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const Balance = result.balance; // Access balance as a number

    // Corrected Bill Calculation
    const Bill = Products.reduce((total, product) => {
      return total + product.quantity * parseFloat(product.price);
    }, 0);

    console.log(Bill, "Total Bill");

    // Check if the user has sufficient balance
    if (Balance < Bill) {
      return new NextResponse(
        JSON.stringify({ message: "Insufficient balance" }),
        { status: 400 }
      );
    }

    console.log(id, Products, "id and product");

    // Send the order to the order API
    const response = await fetch("https://admin-panel-two-beige.vercel.app/api/client/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, Products }),
    });

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ message: "Error in completePurchase" }),
        { status: 500 }
      );
    }

    const isCompleted = await response.json();
    console.log(isCompleted, "isCompleted");

    // Deduct the bill amount from the user's balance
    result.balance -= Bill;

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
