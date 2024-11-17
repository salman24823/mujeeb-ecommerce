"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Newspaper } from "lucide-react";

const Purchases = () => {
  // Fixing initial state of products (should be an array)
  const [products, setProducts] = useState([
    {
      purchaseId: "123456",
      productName: "VISA Gift Card",
      purchaseDate: "2024-10-15",
      amount: "100.00 CAD",
      qty: 2,
    },
    {
      purchaseId: "654321",
      productName: "Amazon Gift Card",
      purchaseDate: "2024-10-12",
      amount: "50.00 USD",
      qty: 1,
    },
    {
      purchaseId: "654321",
      productName: "Amazon Gift Card",
      purchaseDate: "2024-10-12",
      amount: "50.00 USD",
      qty: 1,
    },
    // Add more purchases as needed
  ]);

  // Close dropdown if clicked outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close dropdown logic if needed
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
     
      {/* Table Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        
        <div className="text-indigo-500 text-xl mb-4 flex items-center space-x-2">
          <Newspaper size={24} />
          <span>My Purchase History</span>
        </div>

        <table className="min-w-full text-sm text-gray-400">
          {/* Table Headings */}
          <thead>
            <tr className="border-b border-gray-700">
              <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Purchase ID</td>
              <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Product Name</td>
              <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Purchase Date</td>
              <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Amount</td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-gray-900 }`}
              >
                <td className="py-3 px-6">{product.purchaseId}</td>
                <td className="py-3 px-6">{product.productName}</td>
                <td className="py-3 px-6">{product.purchaseDate}</td>
                <td className="py-3 px-6">{product.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
