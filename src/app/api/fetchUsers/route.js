import dbConnection from "@/config/connectDB";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        // Make a request to the external API
        await dbConnection()

        const result = await userModel.find()

        // Return the data back to the frontend
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
    }

}