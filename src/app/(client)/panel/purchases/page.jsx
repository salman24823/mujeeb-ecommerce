"use client";

import { BoxIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  // Fetch purchases data for the given userId
  const fetchPurchases = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      const data = await response.json();

      console.log(data.orders, "data from API");

      setLoading(false);

      if (response.ok) {
        setPurchases(data.orders);
      } else {
        toast.error(data.message || "Error fetching purchases");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching purchases. Please try again.");
    }
  };

  // Fetch purchases on component mount
  useEffect(() => {
    if (session) {
      fetchPurchases();
    }
  }, [session]);

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Table Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-xl mb-4 flex items-center space-x-2">
          <BoxIcon />
          <span>My Purchases</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-nowrap overflow-x-scroll text-sm text-gray-400">
              {/* Table Headings */}
              <thead>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">BIN</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Card Type</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Issuer</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Issuer Phone</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Issuer URL</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Country</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Card Number</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Expiry</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">Code</td>
                  <td className="py-3 px-6 text-left font-semibold text-gray-300">PIN</td>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {purchases.map((purchase) =>
                  purchase.products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-gray-900"
                    >
                      <td className="py-3 px-4">{product.bin}</td>
                      <td className="py-3 px-4">{product.cardType}</td>
                      <td className="py-3 px-4">{product.issuer}</td>
                      <td className="py-3 px-4">{product.issuerPhone}</td>
                      <td className="py-3 px-4">
                        {product.issuerUrl !== "Unknown" ? (
                          <a
                            href={product.issuerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline"
                          >
                            {product.issuerUrl}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4">{product.country}</td>
                      <td className="py-3 px-4">{product.cardNumber}</td>
                      <td className="py-3 px-4">{product.expiry}</td>
                      <td className="py-3 px-4">{product.code}</td>
                      <td className="py-3 px-4">{product.pin}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
