import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const adminModel = mongoose.models.adminModel || mongoose.model("adminModel", userSchema);

export default adminModel;
