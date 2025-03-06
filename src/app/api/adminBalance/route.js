import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        
        if (!apiKey) {
            return new NextResponse(JSON.stringify({ error: 'API key is missing' }), { status: 500 });
        }

        const response = await fetch('https://api.nowpayments.io/v1/balance', {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        console.log(response,"response")

        if (!response.ok) {
            return new NextResponse(JSON.stringify({ error: 'Failed to fetch balance' }), { status: response.status });
        }

        const data = await response.json();

        console.log(data,"data from balance")

        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
