import depositHistory from "@/models/depositHistory";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req) {
  // Ensure `public/` directory exists (should already in Next.js)
  const publicDir = path.join(process.cwd(), "public");

  // Helper function to save any object to a .txt file
  async function saveToTxtFile(namePrefix, contentObj) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${namePrefix}_${timestamp}.txt`;
    const filePath = path.join(publicDir, fileName);
    const textContent =
      typeof contentObj === "string"
        ? contentObj
        : JSON.stringify(contentObj, null, 2);
    await writeFile(filePath, textContent, "utf8");
    console.log(`📄 Saved to file: ${fileName}`);
  }

  try {
    // Parse request body
    const data = await req.json();
    const funds = data.price_amount;

    // ✅ Save full IPN request data for debugging
    await saveToTxtFile("IPN_REQUEST", data);

    // Log some details for server console
    console.log("✅ Received IPN:", data);

    if (data.status === "finished") {
      console.log(`💰 Payment Finished | Order ID: ${data.order_id}`);

      const result = await depositHistory.findOne({ order_id: data.order_id });

      if (result) {
        if (result.status === "waiting") {
          result.status = "finished";
          result.price_amount = funds;
          await result.save();

          const user = await userModel.findById(result.userID);

          if (user) {
            const updatedBalance = Number(user.balance) + Number(funds);
            user.balance = updatedBalance;
            await user.save();

            console.log(
              `✅ Updated balance for user ${user._id}: ${updatedBalance}`
            );
          } else {
            console.error(`❌ User not found: ${result.userID}`);
            // save this error to a file
            await saveToTxtFile("USER_NOT_FOUND", {
              userID: result.userID,
              order_id: data.order_id,
            });
          }
        } else {
          console.log(`⏳ Status is "${result.status}" – no update made.`);
          await saveToTxtFile("STATUS_NOT_WAITING", {
            order_id: data.order_id,
            status: result.status,
          });
        }
      } else {
        console.error(
          `❌ No deposit history found for order: ${data.order_id}`
        );
        await saveToTxtFile("NO_DEPOSIT_HISTORY", { order_id: data.order_id });
      }
    } else {
      console.log(
        `⏳ Payment status: ${data.payment_status} | Order ID: ${data.order_id}`
      );
      await saveToTxtFile("IPN_STATUS_NOT_FINISHED", {
        order_id: data.order_id,
        status: data.status,
      });
    }

    return NextResponse.json(
      { message: "IPN processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in IPN Handler:", error);
    // Save error details
    await saveToTxtFile("IPN_ERROR", {
      timestamp: new Date().toISOString(),
      message: error,
      status: "500",
      //   stack: error.stack,
    });

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
