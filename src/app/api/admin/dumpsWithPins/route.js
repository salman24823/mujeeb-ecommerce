import { NextResponse } from "next/server";

export const revalidate = 0 ;

export async function GET(req) {
  try {

    console.log("Fetch Start")
    
    const response = await fetch("https://admin-panel-two-beige.vercel.app/api/client/dumpsPin") 

    const data = await response.json()

    console.log(data.length,"data from dumpsPin")

    return NextResponse.json({ data : data },{ status: 200 } );

  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}