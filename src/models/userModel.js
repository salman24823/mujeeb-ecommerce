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
      type: Number, // Change to Number instead of String
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
    // This should be moved to a separate 'purchaseHistory' or 'transactions' array.
    purchaseHistory: [
      {
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'  // Assuming 'Product' is the name of the model you're referencing
          }
        ],
        billAmount: {
          type: Number,  // Numeric value for the bill amount
          required: true
        },
        date: {
          type: Date,
          default: Date.now  // Default to current date if not provided
        }
      }
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create a model
const userModel = mongoose.models.userModel || mongoose.model("userModel", userSchema);

export default userModel;
