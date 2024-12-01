import mongoose from "mongoose";

// Product Schema for MongoDB
const ProductSchema = new mongoose.Schema(
    {
        BIN: {
            type: String,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt
);

// Purchase Schema
const purchaseSchema = new mongoose.Schema(
    {
        user: { 
            type: String, 
        },
        Products: [ProductSchema],  // Array of products with BIN code
        date: { type: Date, default: Date.now },
    },
    { timestamps: true } // Optionally add timestamps to the purchase as well
);

// Create and export the model
const ProductModel = mongoose.models.ProductModel || mongoose.model("ProductModel", purchaseSchema);

export default ProductModel;
