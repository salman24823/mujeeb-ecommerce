"use client";

import { Button } from "@nextui-org/react";
import { ChevronDown, CreditCard } from "lucide-react"; // Assuming you want to use ChevronDown for the dropdown icon
import React, { useState, useRef } from "react";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

const AddFunds = () => {
  const [amount, setAmount] = useState(); // Default value for amount
  const [currency, setCurrency] = useState("usd"); // Default currency is "usd"
  const [loading, setLoading] = useState(false); // Default loading state is false
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle the dropdown visibility
  const dropdownRef = useRef(null); // To manage dropdown positioning

  const MinAmount = 5;

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev); // Toggle the dropdown visibility
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency); // Update the selected currency
    setDropdownOpen(false); // Close the dropdown after selection
  };

  const addFunds = async () => {
    try {

      setLoading(true);
      const order_id = uuidv4(); // This will generate a unique order ID

      // Generate a unique order_id using UUID

      // Validate the amount and ensure the order_id is not already set
      if (!amount || amount < MinAmount) {
        toast.error("Minimum amount is 5$.");
        setLoading(false);
        return;
      }

      const result = await fetch("/api/NowPay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          order_id, // Pass the dynamically generated order_id to the API
        }),
      });

      const response = await result.json();

      setLoading(false);

      if (response.invoice && response.invoice.invoice_url) {
        window.location.href = response.invoice.invoice_url;
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error, "error");
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg text-white">
      <input
        type="number"
        placeholder="Enter Deposit Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="max-md:text-sm w-full mb-4 pl-3 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
      />

      {/* Currency Selector */}
      <div className="relative">
        <Button
          onClick={handleDropdownToggle}
          className="w-full justify-between rounded-md px-6 py-3 bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        >
          {currency.toUpperCase()} {/* Display selected currency */}
          <ChevronDown
            className={`ml-2 w-5 text-gray-300 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute mt-2 left-0 w-52 p-1 overflow-hidden bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 transform transition-all duration-300 ease-out"
          >
            <div>
              {/* Currency options */}
              <Button
                onClick={() => handleCurrencyChange("usd")}
                className="w-full bg-gray-800 flex justify-start text-gray-300 hover:text-gray-200 hover:bg-gray-600 rounded-md px-4 py-2 cursor-pointer transition-all"
              >
                USD
              </Button>
              {/* You can add more currency options here */}
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={addFunds}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg flex items-center justify-center space-x-2 mt-4"
        disabled={loading}
      >
        <CreditCard className="w-5 h-5" />
        <span>{loading ? "Loading..." : "Add Funds"}</span>
      </Button>
    </div>
  );
};

export default AddFunds;
