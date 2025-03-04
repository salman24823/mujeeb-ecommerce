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

    // Define CSV file paths
    const csvFilePinPath = path.join(process.cwd(), "public/dumpsWithPin/dumps.csv");
    const csvFileNoPinPath = path.join(process.cwd(), "public/dumpsNoPin/dumps.csv");

    // Read CSV files
    const readCSV = async (filePath) => {
      try {
        const csvText = await fs.readFile(filePath, "utf8");
        if (!csvText.trim()) {
          console.warn(`⚠️ CSV file is empty: ${filePath}`);
          return [];
        }
        const parsedCSV = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        console.log(`📜 CSV Loaded: ${filePath}`);
        return parsedCSV.data;
      } catch (error) {
        console.error(`❌ Error reading CSV file: ${filePath}`, error);
        return null;
      }
    };

    let csvDataPin = await readCSV(csvFilePinPath);
    let csvDataNoPin = await readCSV(csvFileNoPinPath);

    if (csvDataPin === null || csvDataNoPin === null) {
      return NextResponse.json(
        { message: "Failed to read one or more CSV files." },
        { status: 500 }
      );
    }

    let matchedProducts = [];

    for (const product of Products) {
      const { bin, quantity, label } = product;
      console.log(`🔍 Processing bin: ${bin}, Requested Quantity: ${quantity}, Label: ${label}`);

      let stockData, filePath;

      if (label === "DumpsWithPin") {
        stockData = csvDataPin;
        filePath = csvFilePinPath;
      } else if (label === "DumpsNoPin") {
        stockData = csvDataNoPin;
        filePath = csvFileNoPinPath;
      } else {
        console.warn(`⚠️ Unknown label '${label}' for bin ${bin}`);
        continue;
      }

      let removedRows = [];
      let remainingStock = [];
      let count = 0;

      for (const row of stockData) {
        if (row.bin === bin && count < quantity) {
          removedRows.push(row);
          count++;
        } else {
          remainingStock.push(row);
        }
      }

      if (removedRows.length > 0) {
        console.log(`✅ Removed ${removedRows.length} items of bin ${bin}`);
        matchedProducts.push(...removedRows);

        // Update the corresponding CSV stock
        if (label === "DumpsWithPin") {
          csvDataPin = remainingStock;
        } else {
          csvDataNoPin = remainingStock;
        }
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

    console.log("📉 Updating CSV stock...");

    // Save updated stock back to CSV files
    const saveCSV = async (filePath, data) => {
      try {
        const updatedCSVText = Papa.unparse(data);
        await fs.writeFile(filePath, updatedCSVText, "utf8");
        console.log(`✅ Stock updated in CSV file: ${filePath}`);
      } catch (error) {
        console.error(`❌ Error writing CSV file: ${filePath}`, error);
        throw new Error(`Failed to update CSV file: ${filePath}`);
      }
    };

    try {
      await saveCSV(csvFilePinPath, csvDataPin);
      await saveCSV(csvFileNoPinPath, csvDataNoPin);
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.log(matchedProducts,"matchedProducts from csv`")

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