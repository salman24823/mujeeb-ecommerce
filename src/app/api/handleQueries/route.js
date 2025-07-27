import dbConnection from "@/app/config/connectDB";
import formModel from "@/models/formModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req) {
    await dbConnection();
  
    try {
  
      const data = await formModel.find();

      console.log(data,"Queres DAta")
  
      return new NextResponse(JSON.stringify({ data }), { status: 201 });
    } catch (error) {
      console.error("Error Fetching form:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }