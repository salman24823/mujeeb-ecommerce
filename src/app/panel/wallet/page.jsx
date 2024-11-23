"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  CreditCard,
  User,
  DollarSign,
  Key,
  Mail,
  Calendar,
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

  const barChartData = {
    labels: ["Day", "Week", "Month", "Year"],
    datasets: [
      {
        label: "Total Transactions",
        data: [5, 30, 120, 500],
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
          weight: "bold", // Added weight to title for better visibility
        },
        color: "#FFFFFF", // White title text for contrast
      },
      datalabels: {
        color: "#FFFFFF", // Data label color for better visibility on the bars
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines
        },
      },
    },
  };

  const transactions = [
    {
      date: "2024-11-10",
      type: "Deposit",
      transactionId: "TXN123456",
      amount: "+$200.00",
      orderDetails: " Card-1, Card-2 , Card-3",
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
  ];

  return (
    <div className="w-full bg-gray-800 text-white rounded-lg shadow-xl space-y-8">
      {/* User Info and Bar Chart Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info Card */}
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg space-y-6">
          {/* User Name Section */}
          <div className="flex items-center space-x-3">
            <User className="text-indigo-500 w-6 h-6" />
            <span className="text-indigo-500 text-2xl font-semibold">
              {session.user.username}
            </span>
          </div>

          {/* Total Balance Section */}
          <div className="text-gray-400 text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-400 w-5 h-5" />
              <div>Total Balance:</div>
            </div>
            <div className="text-3xl font-bold text-white">$1,200.00</div>
          </div>

          {/* Account ID Section */}
          <div className="text-gray-400 text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <Key className="text-gray-500 w-5 h-5" />
              <div>Your Account ID:</div>
            </div>
            <div className="text-xs text-gray-500 break-all">abc123xyz789</div>
          </div>

          {/* Email Section
            <div className="text-gray-400 text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="text-gray-500 w-5 h-5" />
                <div>Email:</div>
              </div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </div> */}

          {/* Add Funds Button */}
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg flex items-center justify-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Add Funds</span>
          </Button>
        </div>

        {/* Bar Chart Card for Transactions */}
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg">
          <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
            <ArrowUpRight size={24} />
            <span>Transactions Overview</span>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <ArrowDownRight size={24} />
          <span>Transaction History</span>
        </div>

        {/* Transaction Table */}
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
                  <td
                    colSpan="5"
                    className="py-3 px-4 text-center text-gray-500"
                  >
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
