import mongoose from "mongoose";

// User Schema for MongoDB
const formSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const formModel = mongoose.models.formModel || mongoose.model("formModel", formSchema);

export default formModel;
