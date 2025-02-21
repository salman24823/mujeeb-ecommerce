// import crypto from "crypto";
import depositHistory from "@/models/depositHistory";
import IPNCALLBACK from "@/models/ipnCallBack";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the incoming JSON request body
        const data = await req.json();

        const funds = data.price_amount

        console.log(funds,"funds")

        console.log(data,"data")

        console.log("Received IPN Data:", JSON.stringify(data, null, 2));

        // const saved = await IPNCALLBACK.save(data)

        if (data.status == "finished") {

            console.log(`✅ Payment Finished for Order ID: ${data.order_id}`);
            console.log(`Amount: 💰 ${data.price_amount}`);

            // Fetch the deposit history record by order_id
            console.log(`Fetching deposit history for Order ID: ${data.order_id}`);
            const result = await depositHistory.findOne({ order_id: data.order_id });
            
            if (result) {
                console.log("Deposit history record found:", JSON.stringify(result, null, 2));

                if (result.status == "waiting") {

                    console.log(`Deposit status is "waiting". Updating it to "finished".`);
                    result.status = "finished";

                    result.price_amount = funds;  /////////////////  ???? 

                    // Save the updated deposit history record
                    await result.save();
                    console.log(`Deposit history updated for Order ID: ${data.order_id}`);

                    // Fetch the user by user_id
                    console.log(`Fetching user with ID: ${result.userID}`);
                    console.log(result,"result")

                    const user = await userModel.findById(result.userID);

                    if (user) {
                        // console.log(`User found: ${JSON.stringify(user, null, 2)}`);

                        console.log(user,"user")

                        const ActualBalance = user.balance;
                        console.log(ActualBalance,"ActualBalance")

                        const updatedBalance = Number(ActualBalance) + Number(funds);

                        console.log(updatedBalance,"updatedBalance")

                        // Update the user's balance
                        user.balance = updatedBalance;
                        await user.save();
                        console.log(`Updated balance for user ID: ${user._id} to: ${updatedBalance}`);
                    } else {
                        console.error(`User with ID ${result.userID} not found.`);
                    }
                } else {
                    console.log(`Deposit status for Order ID: ${data.order_id} is not "waiting", no update necessary.`);
                }

            } else {
                console.error(`No deposit history found for Order ID: ${data.order_id}`);
            }

        } else {
            console.log(`⏳ Waiting... | Payment status is ${data.payment_status} for Order ID: ${data.order_id}`);
        }

        // Respond with success for testing
        console.log("IPN processed successfully");
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
