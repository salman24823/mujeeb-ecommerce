"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { User, DollarSign } from "lucide-react";

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
import AddFunds from "./AddFunds";
import TransactionHistory from "./transactionHistory";
import { Button } from "@nextui-org/react";

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
  const [userDetails, setUserDetails] = useState("");

  const [transactionsGraph, setTransactions] = useState([]);

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
      if (response.ok) {
        const transactions = result.result;
        const aggregatedData = aggregateTransactions(transactions);
        setTransactions(aggregatedData);  // Update transactions state
      } else {
        console.log('Invalid transaction data');
      }
    } catch (error) {
      console.log("Error fetching user details", error);
    }
  }
  
  function aggregateTransactions(transactions) {
    const aggregated = {
      day: 0,
      week: 0,
      month: 0,
      year: 0
    };
  
    const now = new Date();
  
    transactions.forEach(transaction => {
      const createdAt = new Date(transaction.createdAt);
      const price = parseFloat(transaction.price_amount);
  
      const diffInDays = Math.floor((now - createdAt) / (1000 * 3600 * 24));
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = now.getMonth() - createdAt.getMonth() + 12 * (now.getFullYear() - createdAt.getFullYear());
      const diffInYears = now.getFullYear() - createdAt.getFullYear();
  
      if (diffInDays <= 1) {
        aggregated.day += price;
      }
  
      if (diffInWeeks <= 1) {
        aggregated.week += price;
      }
  
      if (diffInMonths <= 1) {
        aggregated.month += price;
      }
  
      if (diffInYears <= 1) {
        aggregated.year += price;
      }
    });
  
    return aggregated;
  }
  
  

  const userBalance = userDetails?.result?.balance
  const barChartData = {

    labels: ["Day", "Week", "Month", "Year"],
    datasets: [
      {
        label: "Total Transactions",
        data: [
          transactionsGraph?.day || 0,
          transactionsGraph?.week || 0,
          transactionsGraph?.month || 0,
          transactionsGraph?.year || 0
        ],
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

  async function fetchUserDetails() {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/userDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: session?.user?.id }),
      });

      const result = await response.json();
      setUserDetails(result);
    } catch (error) {
      console.log(error, "error fetching user details");
    }
  }

  useEffect(() => {

    handleDetails()

    if (session?.user?.id) {
      // handleDetails();
      fetchUserDetails();
    }

  }, [session]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-lg shadow-xl space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 max-[770px]:gap-2 gap-8">
        <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center space-x-3">
            <User className="text-indigo-500 w-6 h-6" />
            <span className="text-indigo-500 text-2xl font-semibold">
              {session?.user?.username || "Loading..."}
            </span>
          </div>

          <div className="text-gray-400 flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-400 w-5 h-5" />
              <div className="text-xl font-semibold">Total Balance:</div>
            </div>

            <div className="text-xl font-light text-green-500">

              {userBalance || "Loading..."}

            </div>
          </div>

          <hr className="border-[1px] border-gray-600" />

          {/* payement button */}
          <AddFunds userID={session?.user?.id} />
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

      <div className="margin_div bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-lg">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <ArrowDownRight size={24} />
          <span>Incoming Funds</span>
        </div>
 
        <div className="overflow-x-auto">

          <TransactionHistory />

        </div>
      </div>
    </div>
  );
};

export default Wallet;
