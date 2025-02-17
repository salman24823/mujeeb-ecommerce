import dbConnection from '@/config/connectDB';
import OrdersModel from '@/models/ordersModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnection()

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

        // Fetch orders from database
        const orders = await OrdersModel.find({ userId });
        
        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error("Error processing CSV file:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}