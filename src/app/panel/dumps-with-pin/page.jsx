"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { BoxIcon, ChevronDown, CreditCard, Filter } from "lucide-react";

const DumpsWithPin = () => {
  // Fixing initial state of products (should be an array)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterItems, setFilterItems] = useState([
    { label: "Type", key: "type" },
    { label: "Subtype", key: "subtype" },
    { label: "Country", key: "country" },
    { label: "Bank", key: "bank" },
    { label: "Base", key: "base" },
    { label: "Code", key: "code" },
    { label: "Credit", key: "credit" },
  ]);

  const [filters, setFilters] = useState({
    type: null,
    subtype: null,
    country: null,
    bank: null,
    base: null,
    code: null,
    credit: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(null); // Tracks which filter's dropdown is open
  const dropdownRef = useRef(null); // To detect clicks outside the dropdown

  const handleFilterChange = (filter, value) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  const handleDropdownToggle = (key) => {
    setDropdownOpen((prev) => (prev === key ? null : key)); // Toggle dropdown open/close
  };

  // Memoize filteredProducts to avoid unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return product[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [filters, products]);

  // Create a function to get unique options for a filter
  const getUniqueValues = (key) => {
    return [...new Set(products.map((product) => product[key] || ""))];
  };

  // fetchPins
  const fetchPins = async () => {
    try {
      const response = await fetch("/api/fetchPins/pins");
      if (!response.ok) {
        throw new Error("Failed to fetch pins");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching pins:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    fetchPins();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      
      {/* <div className="text-xl font-semibold flex items-center space-x-2">
        <h1 className="text-gray-200">DUMPS WITH PIN CARDS</h1>
        <CreditCard className="text-indigo-500" />
      </div> */}

      {/* Filters Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-6 flex items-center space-x-2">
          <Filter size={24} />
          <span>Select the Filters</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {filterItems.map(({ label, key }) => (
            <div key={key} className="relative">
              <Button
                onClick={() => handleDropdownToggle(key)}
                className="w-full justify-between rounded-md px-6 py-3 bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {/* Show the selected filter value or the label */}
                {filters[key] ? filters[key] : label}
                <ChevronDown
                  className={`ml-2 w-5 text-gray-300 transition-transform duration-300 ${
                    dropdownOpen === key ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {dropdownOpen === key && (
                <div
                  ref={dropdownRef}
                  className="absolute mt-2  left-0 w-52 p-1 overflow-hidden bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 transform transition-all duration-300 ease-out"
                  // style={{
                  //   opacity: 1, // Dropdown becomes fully visible
                  //   transform: "translateY(0)", // Dropdown slides down
                  // }}
                >
                  <div>
                    {getUniqueValues(key).map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleFilterChange(key, value)}
                        className="w-full bg-gray-800 flex justify-start text-gray-300 hover:text-gray-200 hover:bg-gray-600 rounded-md px-4 py-2 cursor-pointer transition-all focus:outline-0"
                      >
                        {value || "None"}
                      </Button>
                    ))}
                    <Button
                      onClick={() => handleFilterChange(key, null)}
                      className="w-full text-red-500 p-1 rounded-md flex justify-start bg-gray-800 hover:text-gray-300 hover:bg-gray-700 px-4 py-2 cursor-pointer transition-all"
                    >
                      Clear Filter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <BoxIcon size={24} />
          <span>Dumps with Pin</span>
        </div>

        {loading ? (
          <div className="w-full flex justify-center h-20 items-center">
            <Spinner className="w-fit" color="white" />
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-400">
            {/* Table Headings */}
            <thead>
              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  BIN
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  CODE
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  TYPE
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  SUBTYPE
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  CREDIT
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  COUNTRY
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  BANK
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  BASE
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  QTY
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  PRICE
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  ACTION
                </td>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No Products Available
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
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
                        size="sm"
                        className="bg-green-800 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-600 transition-all"
                      >
                        Buy Now
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DumpsWithPin;
