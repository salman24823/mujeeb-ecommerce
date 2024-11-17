"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { ClipboardPen, ShoppingBasket, TriangleAlert } from "lucide-react";
import ActionModel from "./actionModel";

const Cart = () => {
  // Static product list
  const products = [
    {
      bin: "123456",
      code: "P001",
      type: "EBT",
      subtype: "GOLD",
      credit: "$500",
      country: "USA",
      bank: "XYZ Bank",
      base: "USD",
      qty: 10,
      price: "$50",
    },
    {
      bin: "654321",
      code: "P002",
      type: "VISA",
      subtype: "CLASSIC",
      credit: "$200",
      country: "Canada",
      bank: "ABC Bank",
      base: "CAD",
      qty: 15,
      price: "$50",
    },
    // More static products can be added here
  ];

  // Calculate the total price
  const total = products.reduce(
    (sum, product) =>
      sum + parseFloat(product.price.replace("$", "")) * product.qty,
    0
  );

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">

      {/* Cart Header */}
      {/* <div className="text-xl font-semibold flex items-center space-x-2">
        <h1 className="text-gray-200">Shopping Cart</h1>
      </div> */}

      {/* Cart Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="bg-gray-900 text-gray-200 border border-slate-700 p-6 rounded-lg shadow-xl">
          <div className="text-indigo-500 text-lg mb-6 flex items-center space-x-2">
            <ClipboardPen size={24} />
            <span>Cart Summary</span>
          </div>

          <div className="mt-6 space-y-4">
            {/* Item Names */}
            <div className="text-sm">
              <span className="font-semibold">Items in Cart:</span>
              <ul className="mt-2 space-y-1">
                {products.map((product, index) => (
                  <li key={index} className="text-gray-300">
                    {product.code} - {product.type} {product.subtype}
                  </li>
                ))}
              </ul>
            </div>

            {/* <hr className="border border-gray-600" /> */}

            {/* Total Price */}
            <div className="flex justify-between text-lg mt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl">${total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <div className="mt-6 text-center">
              <ActionModel
                size="lg"
                className=" hover:bg-indigo-500 hover:text-white hover:border-0 w-full border border-indigo-500 bg-transparent focus:outline-indigo-500 text-indigo-500 font-semibold py-3"
              >
                Complete Purchase
              </ActionModel>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
          <div className="text-yellow-500 text-lg mb-6 flex items-center space-x-2">
            <TriangleAlert size={24} />
            <span>Important Note</span>
          </div>

          <div className="mt-6 text-gray-400 space-y-4">
            {/* <p className="font-semibold text-lg">Important Information:</p> */}
            <ul className="list-disc pl-6 space-y-2">
              <li>All items are non-refundable once purchased.</li>
              <li>
                Please double-check your order.
              </li>
              <li>
                Ensure you have reviewed all product details and specifications.
              </li>
              <li>
                If you have any doubts, contact our support team for assistance.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cart Items Table */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <ShoppingBasket size={24} />
          <span>My Cart</span>
        </div>

        <table className="min-w-full text-sm text-gray-400">
          {/* Table Headings */}
          <thead>
            <tr className="border-b border-gray-700">
              <td className="py-3 px-4 text-left font-semibold">BIN</td>
              <td className="py-3 px-4 text-left font-semibold">CODE</td>
              <td className="py-3 px-4 text-left font-semibold">TYPE</td>
              <td className="py-3 px-4 text-left font-semibold">SUBTYPE</td>
              <td className="py-3 px-4 text-left font-semibold">CREDIT</td>
              <td className="py-3 px-4 text-left font-semibold">COUNTRY</td>
              <td className="py-3 px-4 text-left font-semibold">BANK</td>
              <td className="py-3 px-4 text-left font-semibold">BASE</td>
              <td className="py-3 px-4 text-left font-semibold">QTY</td>
              <td className="py-3 px-4 text-left font-semibold">PRICE</td>
              <td className="py-3 px-4 text-left font-semibold">ACTION</td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="py-3 px-4 text-center text-gray-500"
                >
                  No Products Available
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="py-3 px-4">{product.bin}</td>
                  <td className="py-3 px-4">{product.code}</td>
                  <td className="py-3 px-4">{product.type}</td>
                  <td className="py-3 px-4">{product.subtype}</td>
                  <td className="py-3 px-4">{product.credit}</td>
                  <td className="py-3 px-4">{product.country}</td>
                  <td className="py-3 px-4">{product.bank}</td>
                  <td className="py-3 px-4">{product.base}</td>
                  <td className="py-3 px-4">{product.qty}</td>
                  <td className="py-3 px-4">{product.price}</td>
                  <td className="py-3 px-4">
                    <Button
                      color="secondary"
                      size="sm"
                      className="bg-transparent border border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-semibold focus:ring-2 focus:ring-red-600 transition-all"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Cart;
