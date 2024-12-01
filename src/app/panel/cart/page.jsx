"use client";

import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { ClipboardPen, ShoppingBasket, TriangleAlert } from "lucide-react";
import ActionModel from "./actionModel";
import Papa from "papaparse"; // CSV parsing library
import { toast } from "react-toastify";

const Cart = () => {
  // States to manage the cart products and CSV data
  const [cart, setCart] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const COST = 5 ; ////// Static Price 

  // Load cart items from localStorage and CSV on component mount
  useEffect(() => {
    const localItems = localStorage.getItem('cart');
    if (localItems) {
      setCart(JSON.parse(localItems)); // Parse to an array of products
    }
    loadCSV(); // Load CSV data

    setLoading(false)

  }, []);

  // Function to load CSV file data
  const loadCSV = async () => {
    try {
      const response = await fetch("/binlist.csv"); // Assuming CSV is in the public folder
      const csvText = await response.text();

      // Use PapaParse to parse the CSV
      Papa.parse(csvText, {
        complete: (result) => {
          setFileData(result.data); // Set parsed CSV data into state
        },
        header: true, // Assuming CSV has headers
      });
    } catch (error) {
      console.error("Error loading CSV:", error);
    }
  };

  // Function to remove product from cart
  const removeFromCart = (index) => {
    const updatedProducts = cart.filter((_, i) => i !== index);
    setCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts)); // Update localStorage

    toast.success("Removed Successfully")
  };

  // Filter fileData based on cart's BIN values
  useEffect(() => {
    if (cart.length > 0 && fileData.length > 0) {
      // Ensure we are comparing the correct values
      const filteredProducts = fileData.filter((product) =>
        cart.some(cartItem => cartItem.BIN === product.BIN) // Matching BIN values
      );
      setProducts(filteredProducts);

    }
  }, [cart, fileData]); // Re-run the filter when cart or fileData changes

  if(loading == true ){
    return(
      <div className="w-full justify-center flex">
        <Spinner color="white" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">

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
                {products.length === 0 ? (
                  <li className="text-gray-300">No items in the cart</li>
                ) : (
                  products.map((product, index) => (
                    <li key={index} className="text-gray-300">
                      {product.Type} - {product.CountryName} Card
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Total Price */}
            <div className="flex justify-between text-lg mt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl"> ${products.length * COST } </span>
            </div>

            {/* Checkout Button */}
            <div className="mt-6 text-center">
              <ActionModel
                size="lg"
                className=" hover:bg-indigo-500 hover:text-white hover:border-0 w-full border border-indigo-500 bg-transparent focus:outline-indigo-500 text-indigo-500 font-semibold py-3"
                products={products}
              />
                
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
            <ul className="list-disc pl-6 space-y-2">
              <li>All items are non-refundable once purchased.</li>
              <li>Please double-check your order.</li>
              <li>Ensure you have reviewed all product details and specifications.</li>
              <li>If you have any doubts, contact our support team for assistance.</li>
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
              <td className="py-3 px-4 text-left font-semibold">INDEX</td>
              <td className="py-3 px-4 text-left font-semibold">TYPE</td>
              <td className="py-3 px-4 text-left font-semibold">CATEGORY</td>
              <td className="py-3 px-4 text-left font-semibold">COUNTRY</td>
           
              <td className="py-3 px-4 text-left font-semibold">ACTION</td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-3 px-4 text-center text-gray-500">
                  No Products Available
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <td className="py-3 px-4">{index+1} </td>
                  <td className="py-3 px-4">{product?.Type || "Not Available"}</td>
                  <td className="py-3 px-4">{product?.Category || "Not Available"}</td>
                  <td className="py-3 px-4">{product?.CountryName || "Not Available"}</td>
                  <td className="py-3 px-4">
                    <Button
                      color="secondary"
                      size="sm"
                      className="bg-transparent border border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-semibold focus:ring-2 focus:ring-red-600 transition-all"
                      onClick={() => removeFromCart(index)} // Call remove function
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
