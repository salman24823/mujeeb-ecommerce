import transactionModel from "@/models/transactionModel"
import { NextResponse } from "next/server"

export default async function POST(){

    const request = req.body()

    try {

        const data = await transactionModel.find()

        NextResponse.send(data)
        
    } catch (error) {
        console.log(error,"error")
    }
}