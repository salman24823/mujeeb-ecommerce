import dbConnection from "@/app/config/connectDB";
import OrdersModel from "@/models/ordersModel";
import { NextResponse } from "next/server";

export const revalidate = 0 ;

export async function GET() {

    try {
        // Make a request to the external API
        await dbConnection()

        const result = await OrdersModel.find()

        // Return the data back to the frontend
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
    }

}