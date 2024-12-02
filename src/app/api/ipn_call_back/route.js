// import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the incoming JSON request body
        const data = await req.json();

        console.log("Incoming IPN Data:", data);

        // Extract NowPayments signature from headers
        // const signature = req.headers.get("x-nowpayments-sig");

        // Load IPN secret from environment variables
        // const secret = process.env.NOWPAYMENTS_IPN_SECRET;

        // Validate the signature
        // const hash = crypto.createHmac("sha512", secret).update(JSON.stringify(data)).digest("hex");

        // if (hash !== signature) {
        //   console.error("Invalid signature received.");
        //   return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
        // }

        // Log the valid request for manual inspection
        console.log("Valid IPN received:", data);

        if (data.payment_status == "finished") {
            console.log(`✅ Payment Finished of amount = 💰 ${data.price_amount}`);
        } else {
            console.log(`⏳ Waiting... | Payment is at Waiting of amount = 💰 ${data.price_amount}`);
        }


        // Respond with success for testing
        return NextResponse.json(
            { message: "IPN processed successfully for testing" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing IPN:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
