import dbConnection from "@/config/connectDB";
import ProductModel from "@/models/ProductsModels";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        // Make a request to the external API
        await dbConnection()

        const result = await ProductModel.find()

        console.log("users" , result)

        // Return the data back to the frontend
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
    }

}