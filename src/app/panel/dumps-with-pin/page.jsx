"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { BoxIcon, ChevronDown, Filter } from "lucide-react";
import { toast } from "react-toastify";
import Papa from "papaparse"; // CSV parsing library

const DumpsWithPin = () => {
  // Fixing initial state of products (should be an array)
  const [products, setProducts] = useState([]);
  const [finalProducts, setFfinalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButtons, setLoadingButtons] = useState(false);
  const rowsPerPage = 50; // Number of rows per page
  const [page, setPage] = useState(1); // Current page

  const [filterItems, setFilterItems] = useState([
    { label: "Type", key: "Type" },
    { label: "Brand", key: "." },
    { label: "Category", key: ".." },
    { label: "Country", key: "CountryName" },
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

  // Create a function to get unique options for a filter
  const getUniqueValues = (key) => {
    return [...new Set(products.map((product) => product[key] || ""))];
  };

  // load bins
  const loadCSV = async () => {
    try {
      // Assuming your CSV file is hosted or uploaded in a public directory
      const response = await fetch("/binlist.csv");
      const csvText = await response.text();

      // Use PapaParse to parse the CSV
      Papa.parse(csvText, {
        complete: (result) => {
          setProducts(result.data); // Set parsed data as products
          setLoading(false);
        },
        header: true, // If your CSV file has headers
      });
    } catch (error) {
      console.error("Error loading CSV:", error);
      setLoading(false);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    loadCSV();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return product[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [filters, products]);

  // Calculate pagination values
  const pages = Math.ceil(filteredProducts.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedProducts = useMemo(
    () => filteredProducts.slice(start, end),
    [page, filteredProducts]
  );

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Filters Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-6 flex items-center space-x-2">
          <Filter size={24} />
          <span>Select the Filters</span>
        </div>

        <div className="grid grid-cols-4 max-[770px]:grid-cols-1 gap-2">
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
      <div className="bg-gray-900 border margin_div border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <BoxIcon size={24} />
          <span>Dumps with Pin</span>
        </div>

        {loading ? (
          <div className="w-full flex justify-center h-20 items-center">
            <Spinner className="w-fit" color="white" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-400">
              {/* Table Headings */}
              <thead>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    TYPE
                  </td>
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    BRAND
                  </td>
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    CATEGORY
                  </td>
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    COUNTRY
                  </td>
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    ISSUER
                  </td>
                  <td className="py-3 px-4 text-left text-sm font-semibold">
                    ACTION
                  </td>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No Products Available
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="py-3 px-4">{product.Type}</td>
                      <td className="py-3 px-4">{product.Brand}</td>
                      <td className="py-3 px-4">{product.Category}</td>
                      <td className="py-3 px-4">{product.CountryName}</td>
                      <td className="py-3 px-4">{product.Issuer}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          className="bg-green-800 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-600 transition-all"
                          onClick={() => {
                            setLoadingButtons((prevState) => ({
                              ...prevState,
                              [product.BIN]: true,
                            }));

                            setTimeout(() => {
                              const cart =
                                JSON.parse(localStorage.getItem("cart")) || [];
                              const isProductInCart = cart.some(
                                (item) => item.BIN === product.BIN
                              );

                              if (isProductInCart) {
                                toast.warning(
                                  "This product is already in your cart."
                                );
                              } else {
                                const productToAdd = { BIN: product.BIN };
                                cart.push(productToAdd);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(cart)
                                );
                                toast.success("Added to cart successfully");
                              }

                              setLoadingButtons((prevState) => ({
                                ...prevState,
                                [product.BIN]: false,
                              }));
                            }, 1000);
                          }}
                        >
                          {loadingButtons[product.BIN]
                            ? "Loading..."
                            : "Add to Cart"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Pagination
            total={pages}
            initialPage={page}
            onChange={(page) => setPage(page)}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default DumpsWithPin;
