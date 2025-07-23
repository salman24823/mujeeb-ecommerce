import dbConnection from "@/config/connectDB";
import UserModel from "@/models/userModel"; // Make sure you have a user model
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const revalidate = 0;

export async function POST(req) {
    await dbConnection();

    try {
        const { username } = await req.json();

        if (!username) {
            return NextResponse.json(
                { message: "Username is required." },
                { status: 400 }
            );
        }

        // Find user by username
        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // or your email service
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS, // your email password or app password
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Account Details",
            text: `Username: ${user.username}\nPassword: ${user.password}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Account details sent to your registered email address." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling forget account request:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
