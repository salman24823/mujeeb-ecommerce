import depositHistory from '@/models/depositHistory';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

// Handle POST request
export async function POST(req) {
    try {
        // Get API key from environment variable for security
        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        if (!apiKey) {
            throw new Error("API key is missing from environment variables.");
        }

        // Parse the request body to get dynamic values
        const requestBody = await req.json();

        console.log(requestBody,"requestBody")

        // Ensure that amount and currency are being passed in the request body
        if (!requestBody.amount || !requestBody.currency || !requestBody) {
            console.log(requestBody, "requestBody")
        }

        // Make a POST request to NowPayments' invoice endpoint
        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,  // Use environment variable
                'Content-Type': 'application/json',  // Specify the content type as JSON
            },
            body: JSON.stringify({
                price_amount: requestBody.amount,  // Use dynamic amount
                price_currency: requestBody.currency,  // Use dynamic currency
                order_id: requestBody.order_id,  // Use dynamic order_id
                ipn_callback_url: process.env.ipn_callback_url, // Ensure this environment variable is set
                success_url: process.env.success_url,  // Ensure this environment variable is set
                cancel_url: process.env.cancel_url,  // Ensure this environment variable is set
            }),
        });

        // Parse the response from NowPayments API
        const data = await response.json();

        const result = await depositHistory.create(
            {
                order_id: data.order_id,
                price_amount: data.price_amount,
                userID: requestBody.userID
            }
        )

        console.log(result, "saved in model result")
        console.log(data, "data from now pay")

        // If the request was successful, return the invoice URL to the frontend
        return NextResponse.json({ status: 201 });

    } catch (error) {
        console.error("Error creating invoice:", error);
        // Return an appropriate error response
        return NextResponse.json({ error: 'Error creating invoice: ' + error.message }, { status: 500 });
    }
}
