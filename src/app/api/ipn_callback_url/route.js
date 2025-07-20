import depositHistory from "@/models/depositHistory";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import { writeFile, appendFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req) {
  const publicDir = path.join(process.cwd(), "public");

  // Save a snapshot object as .txt
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

  // Append user-specific error log
  async function saveUserError(userID, contentObj) {
    const filePath = path.join(publicDir, `user_${userID}.txt`);
    const timestamp = new Date().toISOString();
    const textContent = `[${timestamp}]\n${JSON.stringify(contentObj, null, 2)}\n\n`;
    await appendFile(filePath, textContent, "utf8");
    console.error(`📄 Logged error for user ${userID}`);
  }

  try {
    const data = await req.json();
  //   {
  //   "actually_paid": 11,
  //   "actually_paid_at_fiat": 0,
  //   "fee": {
  //     "currency": "usdtbsc",
  //     "depositFee": 0.133779,
  //     "serviceFee": 0.054332,
  //     "withdrawalFee": 0
  //   },
  //   "invoice_id": 5036726621,
  //   "order_description": null,
  //   "order_id": "8319f2b6-79d8-4d87-b5b9-403cbe542c1b",
  //   "outcome_amount": 10.81189009,
  //   "outcome_currency": "usdtbsc",
  //   "parent_payment_id": null,
  //   "pay_address": "0xa638a632134CdcfDf6c510965757f4963Cca5366",
  //   "pay_amount": 10.99726171,
  //   "pay_currency": "usdtbsc",
  //   "payin_extra_id": null,
  //   "payment_extra_ids": null,
  //   "payment_id": 5699762270,
  //   "payment_status": "finished",
  //   "price_amount": 11,
  //   "price_currency": "usd",
  //   "purchase_id": "4409335830",
  //   "updated_at": 1752957872000
  // }
    const funds = data.price_amount;

    // Save raw IPN data
    await saveToTxtFile("IPN_REQUEST", data);
    console.log("✅ Received IPN:", data);

    if (data.payment_status === "finished") {
      console.log(`💰 Payment Finished | Order ID: ${data.order_id}`);

      const result = await depositHistory.findOne({ order_id: data.order_id });

      if (result) {
        if (result.status === "waiting") {
          try {
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
              await saveUserError(result.userID, {
                type: "USER_NOT_FOUND",
                order_id: data.order_id,
              });
            }
          } catch (err) {
            await saveUserError(result.userID, {
              type: "UPDATE_FAILED",
              error: err.message,
              stack: err.stack,
              order_id: data.order_id,
              status: result.status,
            });
          }
        } else {
          await saveUserError(result.userID, {
            type: "INVALID_STATUS",
            order_id: data.order_id,
            current_status: result.status,
          });
        }
      } else {
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

    // Fallback global log (not per-user)
    await saveToTxtFile("IPN_ERROR", {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
