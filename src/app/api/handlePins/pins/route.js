import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export const revalidate = 0;

const CSV_FILE_PATH = path.join(process.cwd(),"public/dumpsWithPin/dumps.csv");

export async function GET() {
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

export async function POST(req) {
  try {
    const binListPath = path.join(process.cwd(), "public", "binlist.csv");
    const dumpsFilePath = path.join(process.cwd(), "public", "dumpsWithPin", "dumps.csv");
    const NewDumps = await req.json();

    // Read BIN List CSV
    const binListContent = await fs.promises.readFile(binListPath, "utf-8");
    const binListData = Papa.parse(binListContent, { header: true, skipEmptyLines: true });

    // Read Existing Dumps CSV (if available)
    let existingDumps = [];
    try {
      const existingContent = await fs.promises.readFile(dumpsFilePath, "utf-8");
      existingDumps = Papa.parse(existingContent, { header: true, skipEmptyLines: true }).data;
    } catch (err) {
      if (err.code !== "ENOENT") throw err; // Ignore "file not found" error
    }

    const newEntries = [];

    NewDumps.fieldsData.forEach((row) => {
      const pin = row.PIN ? row.PIN.trim() : "N/A"; // Ensure PIN is safely handled

      Object.values(row).forEach((value) => {
        if (typeof value === "string" && /^\d/.test(value) && value.includes("=")) {
          const parts = value.split("=");
          const cardNumber = parts[0].trim();
          const sixDigits = cardNumber.slice(0, 6);
          const afterEqual = parts[1] ? parts[1].trim() : "";
          const expiryDate = afterEqual.slice(0, 4) || "N/A";
          const code = afterEqual.slice(4, 7) || "N/A";

          // Determine Card Type
          let cardType = "Unknown";
          if (cardNumber.startsWith("4")) cardType = "Visa Card";
          else if (cardNumber.startsWith("5")) cardType = "MasterCard";
          else if (cardNumber.startsWith("3")) cardType = "American Express";

          // Find Matching BIN
          const matchedBin = binListData.data.find((bin) => bin.BIN === sixDigits);

          if (matchedBin) {
            newEntries.push({
              key: sixDigits,
              bin: matchedBin.BIN || "Unknown",
              cardType,
              issuer: matchedBin.Issuer || "Unknown",
              issuerPhone: matchedBin.IssuerPhone || "Unknown",
              issuerUrl: matchedBin.IssuerUrl || "Unknown",
              country: matchedBin.CountryName || "Unknown",
              cardNumber,
              expiry: expiryDate,
              code,
              pin,
              price: 5
            });
          }
        }
      });
    });

    // **Ensure Uniqueness in Merging Old & New Entries**
    const uniqueData = [
      ...new Map([...existingDumps, ...newEntries].map(item => [item.cardNumber, item])).values()
    ];

    // Convert Back to CSV & Save
    const csv = Papa.unparse(uniqueData);
    await fs.promises.writeFile(dumpsFilePath, csv);

    return NextResponse.json({ message: "Data appended to dumps.csv successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const { bin, price } = await req.json();

    if (!bin || price === undefined) {
      return NextResponse.json({ error: "BIN and price are required" }, { status: 400 });
    }

    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      return NextResponse.json({ error: "CSV file not found." }, { status: 500 });
    }

    // Read the CSV file
    const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf8");
    if (!fileContent.trim()) {
      return NextResponse.json({ error: "CSV file is empty." }, { status: 500 });
    }

    // Parse CSV content
    let rawData = Papa.parse(fileContent, { header: true, skipEmptyLines: true }).data;

    // Update the price for all matching bins
    let updated = false;
    rawData = rawData.map((row) => {
      if (row.bin === bin) {
        row.price = price;
        updated = true;
      }
      return row;
    });

    if (!updated) {
      return NextResponse.json({ error: "No matching BIN found." }, { status: 404 });
    }

    console.log(updated,"new data price")

    // Convert updated data back to CSV format
    const updatedCSV = Papa.unparse(rawData);

    // Save the updated CSV file
    fs.writeFileSync(CSV_FILE_PATH, updatedCSV, "utf8");

    return NextResponse.json({ success: true, bin, price });
  } catch (error) {
    console.error("❌ Error updating price in CSV:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}