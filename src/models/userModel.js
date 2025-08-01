import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: String, // Change to Number instead of String
      required: true,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "activated", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const userModel =
  mongoose.models.userModel || mongoose.model("userModel", userSchema);

export default userModel;
