import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    
    const data = await req.json(); // Parse the incoming JSON data
    const { id, Products } = data; // Destructure the id and Products from the request

    // Log the incoming request for debugging
    console.log("Received Data:", data);

    // Validate that id and Products are defined
    if (!id) {
      return NextResponse.json(
        { message: "Missing user id." },
        { status: 400 }
      );
    }

    if (!Products || Products.length === 0) {
      return NextResponse.json(
        { message: "No products in the request." },
        { status: 400 }
      );
    }

    // Create a product data array for CSV
    const productData = Products.map((product) => ({
      userId: id || "not given",
      BIN: product.BIN || "not given",
      Brand: product.Brand || "not given",
      Type: product.Type || "not given",
      Category: product.Category || "not given",
      Issuer: product.Issuer || "not given",
      IssuerPhone: product.IssuerPhone || "not given",
      IssuerUrl: product.IssuerUrl || "not given",
      isoCode2: product.isoCode2 || "not given",
      isoCode3: product.isoCode3 || "not given",
      CountryName: product.CountryName || "not given",
    }));

    // Path to the CSV file in the 'public' directory
    const csvFilePath = path.join(process.cwd(), "public", "purchasing.csv"); // Correct path

    // Check if the file exists
    let fileExists = fs.existsSync(csvFilePath);

    // If the file exists, append data, else create a new file and write the headers
    const csvString = Papa.unparse(productData, {
      header: !fileExists, // Write headers if file doesn't exist
      columns: [
        "userId",
        "BIN",
        "Brand",
        "Type",
        "Category",
        "Issuer",
        "IssuerPhone",
        "IssuerUrl",
        "isoCode2",
        "isoCode3",
        "CountryName",
      ], // Specify columns explicitly
    });

    // Append the CSV data to the file
    fs.appendFileSync(csvFilePath, csvString + "\n", "utf8");

    // Respond with a success message
    return NextResponse.json(
      { message: "Purchase data saved to CSV file." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in Saving CSV Data:", error);

    // Log the error for debugging
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }

}
