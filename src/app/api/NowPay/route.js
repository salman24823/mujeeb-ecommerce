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

        // Ensure that amount and currency are being passed in the request body
        if (!requestBody.amount || !requestBody.currency) {
            throw new Error("Amount and currency are required.");
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

        if (response.ok) {
            // If the request was successful, return the invoice URL to the frontend
            return NextResponse.json({ invoice: data }, { status: 201 });
        } else {
            // If there was an error in the API response, return the error message from the API
            console.error("NOWPayments API error:", data);
            return NextResponse.json({ error: data.error || 'Unknown error' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error creating invoice:", error);
        // Return an appropriate error response
        return NextResponse.json({ error: 'Error creating invoice: ' + error.message }, { status: 500 });
    }
}
