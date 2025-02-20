"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const TransactionHistory = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);

  // Fetch transaction details
  async function handleDetails() {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/fetchPurchaseHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: session?.user?.id }),
      });

      const result = await response.json();

      console.log(result,"result")

      if (response.ok) {
        setTransactions(result);  // Update transactions state
      } else {
        console.log('Invalid transaction data');
      }

      console.log(transactions,"transactions")

    } catch (error) {
      console.log("Error fetching user details", error);
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      handleDetails();
    }
  }, [session]);

  return (
    <table className="min-w-full text-sm text-gray-400">
    <thead>
      <tr className="border-b border-gray-700">
        <th className="py-3 px-4 text-left whitespace-nowrap">Date</th>
        <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
        <th className="py-3 px-4 text-left whitespace-nowrap">Transaction ID</th>
        <th className="py-3 px-4 text-left whitespace-nowrap">Amount</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(transactions) && transactions.length === 0 ? (
        <tr>
          <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
            No Transactions Available
          </td>
        </tr>
      ) : (
        transactions.result
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
          .map((txn, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <td className="py-3 px-4 whitespace-nowrap">
                {new Date(txn.createdAt).toLocaleDateString()}
              </td>
              <td className={`py-3 px-4 whitespace-nowrap 
                ${txn.status === 'finished' ? 'text-green-500' : 
                 txn.status === 'waiting' ? 'text-yellow-500' : 
                 txn.status === 'cancelled' ? 'text-red-500' : 'text-gray-500'}
              `}>
                {txn.status}
              </td>
              <td className="py-3 px-4 whitespace-nowrap">{txn.order_id}</td>
              <td className={`py-3 px-4 whitespace-nowrap`}>
                {txn.price_amount || 'N/A'}
              </td>
            </tr>
          ))
      )}
    </tbody>
  </table>
  
  );
  
};

export default TransactionHistory;
