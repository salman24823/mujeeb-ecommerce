import dbConnection from "@/app/config/connectDB";
import formModel from "@/models/formModel";
import { NextResponse } from "next/server";

export const revalidate = 0;


export async function GET() {
  await dbConnection();

  try {
    const result = await formModel.find();
    return new NextResponse(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json(); // Extract the data sent with the request
    
    // Destructure the required fields from the request data
    const { name , message , subject , userID } = data.formData;
    
    // Check if all required fields are present
    if (!name || !message || !userID) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Create a new form document
    const result = new formModel({
      name,
      subject,
      message,
      userID 
    });

    // Save the document to the database
    await result.save();

    return new NextResponse(JSON.stringify({ message: "Success" }), { status: 201 });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnection();

  try {
    const { id, reply } = await req.json();

    if (!id || !reply) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const updatedQuery = await formModel.findByIdAndUpdate(id, { reply }, { new: true });

    if (!updatedQuery) {
      return NextResponse.json({ message: "Query not found." }, { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "Reply added successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error replying to query:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
