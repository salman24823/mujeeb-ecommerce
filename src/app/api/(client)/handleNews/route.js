import dbConnection from "@/config/connectDB";
import NewsModel from "@/models/newsModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  await dbConnection();

  try {
    const result = await NewsModel.find();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json(); // Parse the incoming JSON data
    const { newsTitle, newsDescription, newsLinks } = data;

    // Validate the incoming data
    if (
      !newsTitle ||
      !newsDescription ||
      !newsLinks ||
      newsLinks.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Save the news to the database (mocked here)
    const result = await NewsModel({
      title: newsTitle,
      description: newsDescription,
      links: newsLinks,
    });

    // save in the mongo db
    await result.save();

    // Fetch the updated list of news after deletion
    const updatedNews = await NewsModel.find();
    return new NextResponse(JSON.stringify(updatedNews), { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { newsId } = await req.json(); // Parse the request body

    if (!newsId) {
      return new NextResponse(JSON.stringify({ message: "News ID is required" }), { status: 400 });
    }

    // Connect to the database
    await dbConnection();

    // Attempt to delete the news document with the provided newsId
    const result = await NewsModel.findByIdAndDelete(newsId);

    // Check if the document was found and deleted
    if (!result) {
      return new NextResponse(JSON.stringify({ message: "News not found" }), { status: 404 });
    }

    // Fetch the updated list of news after deletion
    const updatedNews = await NewsModel.find();
    return new NextResponse(JSON.stringify(updatedNews), { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);
    return new NextResponse(JSON.stringify({ message: "Error deleting news" }), { status: 500 });
  }
}
