import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  const CSV_FILE_PATH = path.join(
    process.cwd(),
    "public/dumpsWithPin/dumps.csv"
  );
  try {
    // Read CSV file directly from the filesystem
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error("❌ CSV file not found:", CSV_FILE_PATH);
      return NextResponse.json(
        { message: "CSV file not found." },
        { status: 500 }
      );
    }

    const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf8");
    if (!fileContent.trim()) {
      console.warn("⚠️ CSV file is empty");
      return NextResponse.json(
        { message: "CSV file is empty." },
        { status: 500 }
      );
    }

    // Parse CSV
    const rawData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;

    // Process data into a map
    const dataMap = new Map();
    rawData.forEach((row) => {
      const key = row.bin || "Unknown";
      if (dataMap.has(key)) {
        dataMap.get(key).quantity += 1;
      } else {
        dataMap.set(key, {
          key,
          bin: row.bin || "Unknown",
          cardType: row.cardType || "Unknown",
          issuer: row.issuer || "Unknown",
          issuerPhone: row.issuerPhone || "Unknown",
          issuerUrl: row.issuerUrl || "Unknown",
          country: row.country || "Unknown",
          cardNumber: row.cardNumber || "Unknown",
          expiry: row.expiry || "N/A",
          code: row.code || "N/A",
          pin: row.pin || "N/A",
          quantity: 1,
          price: row.price || "N/A",
        });
      }
    });

    // Convert map values to an array
    const formattedData = Array.from(dataMap.values());

    console.log("📊 data from dumpsPin", formattedData.length);

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching CSV:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
