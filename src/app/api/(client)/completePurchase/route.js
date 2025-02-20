import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import Papa from "papaparse";
import fs from "fs/promises";
import path from "path";
import ordersModel from "@/models/ordersModel";

export const revalidate = 0;

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();
    const { id, Products } = data;

    // Validate input
    if (!id || !Array.isArray(Products) || Products.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await userModel.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const { balance } = user;

    // Calculate total bill
    const totalBill = Products.reduce((sum, product) => {
      return sum + product.quantity * parseFloat(product.price);
    }, 0);

    console.log(`🧾 Total Bill: ${totalBill}`);

    // Check if user has enough balance
    if (balance < totalBill) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    console.log(`🔎 Processing order for user ${id}...`);

    // Define CSV file path
    const csvFilePath = path.join(process.cwd(), "public/dumpsWithPin/dumps.csv");
    console.log(`📂 CSV File Path: ${csvFilePath}`);

    // Read CSV file
    let csvText;
    try {
      csvText = await fs.readFile(csvFilePath, "utf8");
      console.log("📜 CSV File Read Successfully");
    } catch (fileError) {
      console.error("❌ Error reading CSV file:", fileError);
      return NextResponse.json(
        { message: "Failed to read CSV file." },
        { status: 500 }
      );
    }

    if (!csvText.trim()) {
      console.warn("⚠️ CSV file is empty");
      return NextResponse.json(
        { message: "CSV file is empty." },
        { status: 500 }
      );
    }

    // Parse CSV
    let csvData;
    try {
      const parsedCSV = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      csvData = parsedCSV.data;
      console.log("✅ CSV Parsed Successfully");
    } catch (parseError) {
      console.error("❌ CSV Parsing Error:", parseError);
      return NextResponse.json(
        { message: "Error parsing CSV file." },
        { status: 500 }
      );
    }

    console.log("📊 Initial Stock Count:", csvData.length);

    let matchedProducts = [];

    for (const product of Products) {
      const { bin, quantity } = product;
      console.log(`🔍 Processing bin: ${bin}, Requested Quantity: ${quantity}`);

      let removedRows = [];
      let remainingStock = [];
      let count = 0;

      for (const row of csvData) {
        if (row.bin === bin && count < quantity) {
          removedRows.push(row); // Select items to be removed
          count++;
        } else {
          remainingStock.push(row); // Keep the rest in stock
        }
      }

      if (removedRows.length > 0) {
        console.log(`✅ Removed ${removedRows.length} items of bin ${bin}`);
        matchedProducts.push(...removedRows);
        csvData = remainingStock; // Update stock data
      } else {
        console.warn(`⚠️ No sufficient stock available for bin ${bin}`);
      }
    }

    if (matchedProducts.length === 0) {
      console.warn("❌ No matching products found in stock");
      return NextResponse.json(
        { message: "No matching products found in stock." },
        { status: 404 }
      );
    }

    console.log("📉 Updated Stock Count:", csvData.length);

    // Save updated stock back to CSV
    try {
      const updatedCSVText = Papa.unparse(csvData);
      await fs.writeFile(csvFilePath, updatedCSVText, "utf8");
      console.log("✅ Stock updated in CSV file");
    } catch (writeError) {
      console.error("❌ Error writing CSV file:", writeError);
      return NextResponse.json(
        { message: "Failed to update CSV file." },
        { status: 500 }
      );
    }

    // Save order to database
    try {
      const newOrder = new ordersModel({
        userId: id,
        products: matchedProducts,
      });
      await newOrder.save();
      console.log("✅ Order saved to database:", newOrder);
    } catch (dbError) {
      console.error("❌ Error saving order to database:", dbError);
      return NextResponse.json(
        { message: "Failed to save order." },
        { status: 500 }
      );
    }

    // Deduct the bill amount from the user's balance and save
    try {
      user.balance -= totalBill;
      await user.save();
      console.log(`💰 Updated User Balance: ${user.balance}`);
    } catch (balanceError) {
      console.error("❌ Error updating user balance:", balanceError);
      return NextResponse.json(
        { message: "Failed to update user balance." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Purchase successful", matchedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
