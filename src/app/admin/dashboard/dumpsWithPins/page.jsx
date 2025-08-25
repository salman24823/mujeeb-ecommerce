"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Spinner } from "@nextui-org/react";
import AddPins from "./AddPins";
import { Button } from "@nextui-org/react"; // Assuming Button component is from nextui
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const DumpsWithPin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState("");

  const [filterItems, setFilterItems] = useState([
    { label: "Type", key: "cardType" },
    { label: "Country", key: "country" },
  ]);
  const [filters, setFilters] = useState({
    type: null,
    country: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const rowsPerPage = 50; // Adjust rows per page as needed
  const [page, setPage] = useState(1); // Initial page

  const handleFilterChange = (filter, value) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  const handleDropdownToggle = (key) => {
    setDropdownOpen((prev) => (prev === key ? null : key)); // Toggle dropdown open/close
  };

  // Get unique values for the filters
  const getUniqueValues = (key) => {
    return [...new Set(products.map((product) => product[key] || ""))];
  };

  // Load CSV Data
  const loadCSV = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/handlePins/pins");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading CSV:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Filter products based on selected filters
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

  const handlePriceUpdate = async (bin) => {
    if (!priceInput.trim()) return;

    try {
      const response = await fetch("/api/handlePins/pins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bin,
          price: parseFloat(priceInput),
        }),
      });

      if (!response.ok) throw new Error("Failed to update price");

      setProducts((prev) =>
        prev.map((product) =>
          product.bin === bin
            ? { ...product, price: parseFloat(priceInput) }
            : product
        )
      );

      setEditingPrice(null);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  function handleDelete(bin){

    // ask confirmation from user
      if(!confirm("Are you sure you want to delete this pin?")) return;

    try {

      fetch("/api/handlePins/pins", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bin
        }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete pin");

        toast.success(`Bins ${bin} deleted successfully`);

        loadCSV();
      });
      
    } catch (error) {

      console.error("Error deleting pin:", error);
      
    }

  }

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Filters Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-6 flex items-center space-x-2">
          <span>Select the Filters</span>
        </div>

        <div className="grid grid-cols-4 max-[770px]:grid-cols-1 gap-2">
          {filterItems.map(({ label, key }) => (
            <div key={key} className="relative">
              <Button
                onClick={() => handleDropdownToggle(key)}
                className="w-full justify-between rounded-md px-6 py-3 bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
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
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <span>Dumps with Pin</span>
        </div>

        {loading ? (
          <div className="w-full flex justify-center h-20 items-center">
            <Spinner className="w-fit" color="white" />
          </div>
        ) : (
          <div className="overflow-x-scroll text-nowrap custom-scrollbar">
            <table className="min-w-full text-sm text-gray-400">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">BIN</th>
                  <th className="py-3 px-4 text-left">DUMP</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Issuer</th>
                  <th className="py-3 px-4 text-left">Issuer Phone</th>
                  <th className="py-3 px-4 text-left">Issuer URL</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">Card Number</th>
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Expiry</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No Products Available
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">{start + index + 1}</td>
                      <td className="py-3 px-4">{product.bin}</td>
                      <td className="py-3 px-4">{product.dump}</td>
                      <td className="py-3 px-4">{product.cardType}</td>
                      <td className="py-3 px-4">{product.issuer}</td>
                      <td className="py-3 px-4">{product.issuerPhone}</td>
                      <td className="py-3 px-4">{product.issuerUrl}</td>
                      <td className="py-3 px-4">{product.country}</td>
                      <td className="py-3 px-4">{product.cardNumber}</td>
                      <td className="py-3 px-4">{product.code}</td>
                      <td className="py-3 px-4">{product.expiry}</td>
                      <td className="py-3 px-4">{product.quantity}</td>

                      {/* Editable Price Column */}
                      <td className="py-3 px-4">
                        {editingPrice === product.bin ? (
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handlePriceUpdate(product.bin);
                            }}
                            onBlur={() => setEditingPrice(null)}
                            autoFocus
                            className="w-16 p-1 bg-gray-700 text-white border border-gray-600 rounded outline-none"
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingPrice(product.bin);
                              setPriceInput(product.price);
                            }}
                            className="cursor-pointer text-green-500 hover:text-indigo-400"
                          >
                            $ {product.price}
                          </span>
                        )}
                      </td>
                      <td>
                        <Button onClick={()=> handleDelete(product.bin)} size="sm" color="danger">Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex w-fit border border-gray-700 rounded-full overflow-hidden gap-5 items-center mt-4">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-none bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </Button>

          <span className="text-gray-300">
            Page {page} of {pages || 1}
          </span>

          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages}
            className="px-4 py-2 rounded-none bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
      <AddPins loadCSV={loadCSV} />
    </div>
  );
};

export default DumpsWithPin;
