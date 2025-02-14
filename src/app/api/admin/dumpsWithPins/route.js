import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    
    const response = await fetch("https://admin-panel-two-beige.vercel.app/api/client/dumpsPin") 

    const data = await response.json()

    return NextResponse.json({ data : data },{ status: 200 } );

  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
