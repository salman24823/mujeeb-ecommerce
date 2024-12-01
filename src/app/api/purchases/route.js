import Papa from 'papaparse';  // Import papaparse
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the incoming request data
        const data = await req.json();
        const { userId } = data;  // Assuming the user ID is provided in the request

        // Validate userId
        if (!userId) {
            return NextResponse.json(
                { message: "Missing userId field." },
                { status: 400 }
            );
        }

        // Path to the CSV file in the public folder
        const csvFilePath = path.join(process.cwd(), 'public', 'purchasing.csv'); // Correct path

        // Read the CSV file content
        const csvFile = fs.readFileSync(csvFilePath, 'utf8');

        // Return a promise for parsing the CSV asynchronously
        return new Promise((resolve, reject) => {
            Papa.parse(csvFile, {
                header: true,  // This option tells PapaParse to treat the first row as headers
                skipEmptyLines: true,  // Skip any empty lines in the CSV
                complete: (result) => {
                    try {
                        // Filter the parsed data based on userId
                        const filteredResults = result.data.filter(row => row.userId === userId.toString());

                        // Log the filtered results
                        console.log("Filtered CSV Data:", filteredResults);

                        // Send the filtered results as a JSON response
                        resolve(NextResponse.json({ message: "CSV file processed successfully.", filteredResults }, { status: 200 }));
                    } catch (error) {
                        reject(error);  // Handle any errors that may occur during filtering
                    }
                },
                error: (error) => {
                    // Handle parsing errors
                    console.error("Error parsing CSV:", error);
                    reject(new Error("Error parsing CSV."));
                }
            });
        });

    } catch (error) {
        console.error("Error processing CSV file:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
