"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  CreditCard,
  User,
  DollarSign,
} from "lucide-react";

import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSession } from "next-auth/react";

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  ChartDataLabels
);

const Wallet = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState();
  const [transactions, setTransactions] = useState([
    {
      date: "2024-11-10",
      type: "Deposit",
      transactionId: "TXN123456",
      amount: "+$200.00",
      orderDetails: "Card-1, Card-2 , Card-3",
      color: "text-green-500",
    },
    {
      date: "2024-11-09",
      type: "Purchase",
      transactionId: "TXN123457",
      amount: "-$75.00",
      orderDetails: "Card-4",
      color: "text-red-500",
    },
    {
      date: "2024-11-08",
      type: "Deposit",
      transactionId: "TXN123458",
      amount: "+$150.00",
      orderDetails: "Card-5 , Card-6",
      color: "text-green-500",
    },
  ]);

  const barChartData = {
    labels: ["Day", "Week", "Month", "Year"],
    datasets: [
      {
        label: "Total Transactions",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Transactions Over Time",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#FFFFFF",
      },
      datalabels: {
        color: "#FFFFFF",
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  async function handleDetails() {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/transactionDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const result = await response.json();
      console.log(result, "result from the transaction details");
      setTransactions(result);
    } catch (error) {
      console.log(error, "error from fetching the transaction details");
    }
  }

  async function fetchUserDetails() {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/userDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: session.user.id }),
      });

      const result = await response.json();
      setUserDetails(result);
    } catch (error) {
      console.log(error, "error fetching user details");
    }
  }

  const addFunds = () => {
    alert("Add Funds function");
  };

  useEffect(() => {
    if (session?.user?.id) {
      handleDetails();
      fetchUserDetails();
    }
  }, [session]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-lg shadow-xl space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center space-x-3">
            <User className="text-indigo-500 w-6 h-6" />
            <span className="text-indigo-500 text-2xl font-semibold">
              {session?.user?.username || "Loading..."}
            </span>
          </div>

          <div className="text-gray-400 text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-400 w-5 h-5" />
              <div>Total Balance:</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {userDetails?.result.balance || "Loading..."}
            </div>
          </div>

          <Button
            onClick={addFunds}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Add Funds</span>
          </Button>
        </div>

        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg">
          <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
            <ArrowUpRight size={24} />
            <span>Transactions Overview</span>
          </div>

          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <ArrowDownRight size={24} />
          <span>Transaction History</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-400">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Transaction</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Order Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                    No Transactions Available
                  </td>
                </tr>
              ) : (
                transactions.map((txn, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4">{txn.date}</td>
                    <td className="py-3 px-4">{txn.type}</td>
                    <td className="py-3 px-4">{txn.transactionId}</td>
                    <td className={`py-3 px-4 ${txn.color}`}>{txn.amount}</td>
                    <td className="py-3 px-4">{txn.orderDetails}</td>
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

export default Wallet;
