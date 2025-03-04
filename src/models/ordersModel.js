import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        bin: String,
        cardType: String,
        issuer: String,
        issuerPhone: String,
        issuerUrl: String,
        country: String,
        cardNumber: String,
        expiry: String,
        code: String,
        pin: String,
        dump: String,
      },
    ],
  },
  { timestamps: true }
);

const OrdersModel = mongoose.models.Orders || mongoose.model("Orders", OrderSchema);
export default OrdersModel;
