import mongoose from "mongoose";

// Schema for the IPN payment data (as per the provided JSON structure)
const paymentSchema = new mongoose.Schema(
    {
        actually_paid: {
            type: Number,
            
            default: 0,
        },
        actually_paid_at_fiat: {
            type: Number,
            
            default: 0,
        },
        fee: {
            currency: {
                type: String,
                
            },
            depositFee: {
                type: Number,
                
                default: 0,
            },
            serviceFee: {
                type: Number,
                
                default: 0,
            },
            withdrawalFee: {
                type: Number,
                
                default: 0,
            },
        },
        invoice_id: {
            type: Number,
            
        },
        order_description: {
            type: String,
            default: null,
        },
        order_id: {
            type: String,
            default: null,
        },
        outcome_amount: {
            type: Number,
            
        },
        outcome_currency: {
            type: String,
            
        },
        parent_payment_id: {
            type: String,
            default: null,
        },
        pay_address: {
            type: String,
            
        },
        pay_amount: {
            type: Number,
            
        },
        pay_currency: {
            type: String,
            
        },
        payin_extra_id: {
            type: String,
            default: null,
        },
        payment_extra_ids: {
            type: String,
            default: null,
        },
        payment_id: {
            type: Number,
            
        },
        payment_status: {
            type: String,
            
            enum: ["waiting", "finished", "failed"], // Add possible statuses
        },
        price_amount: {
            type: Number,
            
        },
        price_currency: {
            type: String,
            
        },
        purchase_id: {
            type: String,
            
        },
        updated_at: {
            type: Number,
            
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the model based on the schema
const IPNCALLBACK = mongoose.models.IPNCALLBACK || mongoose.model("IPNCALLBACK", paymentSchema);

export default IPNCALLBACK;
