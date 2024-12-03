import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
        },
        price_amount: {
            type: String,
        },
        status: {
            type: String,
            default : "waiting"
        },
        order_id: {
            type: String,
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const depositHistory = mongoose.models.depositHistory || mongoose.model("depositHistory", userSchema);

export default depositHistory;
