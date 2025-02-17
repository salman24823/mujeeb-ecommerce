"use client";

import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { ClipboardPen, ShoppingBasket, TriangleAlert } from "lucide-react";
import ActionModel from "./actionModel";
import { toast } from "react-toastify";
import ActionModal from "./actionModel";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const COST = 5; // Static Price

  // Load cart items from localStorage
  function getCart() {
    setLoading(true);
    const localItems = localStorage.getItem("cart");
    if (localItems) {
      setCart(JSON.parse(localItems));
    } else {
      setCart([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    getCart();
  }, []);

  // Remove product from cart
  const removeFromCart = (index) => {
    setLoading(true);
    const updatedProducts = cart.filter((_, i) => i !== index);
    setCart(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
    toast.success("Removed Successfully");
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Cart Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 max-[770px]:gap-2 gap-8">
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
                {loading ? (
                  <li className="text-gray-300">Loading...</li>
                ) : cart.length === 0 ? (
                  <li className="text-gray-300">No items in cart</li>
                ) : (
                  cart.map((value, index) => (
                    <li key={index} className="text-gray-300">
                      Cards with bin{" "}
                      <span className="text-green-500"> {value.bin} </span> ={" "}
                      {value.quantity}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <hr className="border-dashed border-gray-500" />

            {/* Total Price */}
            <div className="flex justify-between text-lg mt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl"> ${cart.length * COST} </span>
            </div>
          </div>

          <ActionModal cart={cart} setCart={setCart} />
        </div>

        {/* Important Note */}
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
          <div className="text-yellow-500 text-lg mb-6 flex items-center space-x-2">
            <TriangleAlert size={24} />
            <span>Important Note</span>
          </div>

          <div className="mt-6 text-gray-400 space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>All items are non-refundable once purchased.</li>
              <li>Please double-check your order.</li>
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
      <div className="bg-gray-900 border margin_div border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <ShoppingBasket size={24} />
          <span>My Cart</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-400">
            {/* Table Headings */}
            <thead>
              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  INDEX
                </td>
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  BIN
                </td>
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  TYPE
                </td>
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  COUNTRY
                </td>
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  Quantity
                </td>
                <td className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                  Action
                </td>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Spinner size="sm" /> <span> Laoding... </span>
                    </span>
                  </td>
                </tr>
              ) : cart.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No items in cart
                  </td>
                </tr>
              ) : (
                cart.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {product?.bin || "Not Available"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {product?.cardType || "Not Available"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {product?.country || "Not Available"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {product?.quantity || "Not Available"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Button
                        color="secondary"
                        size="sm"
                        className="bg-transparent border border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-semibold focus:ring-2 focus:ring-red-600 transition-all"
                        onClick={() => removeFromCart(index)}
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
    </div>
  );
};

export default Cart;
