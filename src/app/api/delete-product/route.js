import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { bin } = await req.json(); 

    // Path to your CSV file
    const csvFilePath = path.join(process.cwd(), 'public/binlist.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV into an array
    const rows = csvContent.split('\n');
    const headers = rows.shift(); // Extract headers
    const filteredRows = rows.filter((row) => !row.startsWith(bin)); // Remove the row with the matching BIN

    // Write updated content back to the CSV
    fs.writeFileSync(csvFilePath, [headers, ...filteredRows].join('\n'), 'utf-8');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: "Failed to delete product" }), { status: 500 });
  }
}
