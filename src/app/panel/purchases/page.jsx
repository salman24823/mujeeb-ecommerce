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
        body: JSON.stringify({ userId: session.user.id }),
      });

      const data = await response.json();

      console.log(data.filteredResults, "data");

      setLoading(false);

      if (response.ok) {
        setPurchases(data.filteredResults); // Assuming 'filteredResults' contains the filtered rows
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
            {/* Apply custom scrollbar styles */}
            <table className="min-w-full text-sm text-gray-400">
              {/* Table Headings */}
              <thead>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">BIN</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Brand</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Type</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Category</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Issuer</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">IssuerPhone</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">IssuerURL</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">isoCode2</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">isoCode3</td>
                  <td className="py-3 px-6 text-left text-sm font-semibold text-gray-300">Country Name</td>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-gray-900"
                  >
                    <td className="py-3 px-4">{purchase.BIN}</td>
                    <td className="py-3 px-4">{purchase.Brand}</td>
                    <td className="py-3 px-4">{purchase.Type}</td>
                    <td className="py-3 px-4">{purchase.Category}</td>
                    <td className="py-3 px-4">{purchase.Issuer}</td>
                    <td className="py-3 px-4">{purchase.IssuerPhone}</td>
                    <td className="py-3 px-4">{purchase.IssuerUrl}</td>
                    <td className="py-3 px-4">{purchase.isoCode2}</td>
                    <td className="py-3 px-4">{purchase.isoCode3}</td>
                    <td className="py-3 px-4">{purchase.CountryName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
