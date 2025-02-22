import dbConnection from "@/config/connectDB";
import formModel from "@/models/formModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req) {
    await dbConnection();
  
    try {
      const data = await req.json();

      console.log(data,"data")

      if (!data) {
        return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
      }
  
      const result = await formModel.find({userID : data.myID});

      console.log(result,"result")
  
      return new NextResponse(JSON.stringify({ result }), { status: 201 });
    } catch (error) {
      console.error("Error Fetching form:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }