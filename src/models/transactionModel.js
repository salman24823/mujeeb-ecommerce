import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
    },
    date: {
      type: String,
    },
    type: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: String,
    },
    orderDetails: {
      type: String,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const transactionModel = mongoose.models.transactionModel || mongoose.model("transactionModel", userSchema);

export default transactionModel;
