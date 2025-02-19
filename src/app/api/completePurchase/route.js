import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import ordersModel from "@/models/ordersModel";
import dbConnection from "@/config/connectDB";

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();
    const { id, Products } = data;

    console.log(Products, "Products");

    if (!id) {
      return NextResponse.json({ message: "Missing user id." }, { status: 400 });
    }

    if (!Products || Products.length === 0) {
      return NextResponse.json({ message: "No products in the request." }, { status: 400 });
    }

    // Path to the CSV file
    const csvFilePath = path.join(process.cwd(), "public/dumpsWithPin/dumps.csv");

    // Read the file content synchronously
    const fileContent = fs.readFileSync(csvFilePath, "utf8");

    // Parse CSV content using PapaParse
    const { data: csvData } = Papa.parse(fileContent, {
      header: true, // Parse CSV headers
      skipEmptyLines: true,
    });

    let updatedCSVData = [...csvData]; // Make a copy of CSV data

    // Find matching products and update stock
    const matchedProducts = Products.map((product) => {
      const csvRow = csvData.find((row) => row.bin === product.bin);
      if (csvRow) {
        let stock = parseInt(csvRow.quantity, 10);
        let purchasedQuantity = product.quantity;

        if (stock >= purchasedQuantity) {
          // Deduct stock
          csvRow.quantity = stock - purchasedQuantity;
        } else {
          // If not enough stock, throw an error
          throw new Error(`Not enough stock for BIN ${product.bin}`);
        }

        return { ...csvRow, quantity: purchasedQuantity }; // Save only the purchased quantity
      }
      return null;
    }).filter(Boolean); // Remove null values

    console.log("Matched Products:", matchedProducts);

    // Save order to the database
    const newOrder = new ordersModel({ userId: id, products: matchedProducts });
    await newOrder.save();

    // Update CSV file with new stock values
    const updatedCSV = Papa.unparse(updatedCSVData);

    // Write back to the CSV file
    fs.writeFileSync(csvFilePath, updatedCSV, "utf8");

    return NextResponse.json(
      { message: "Order saved successfully and stock updated", matchedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
