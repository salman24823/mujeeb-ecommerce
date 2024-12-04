"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { CreditCard, User, DollarSign } from "lucide-react";

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



  const barChartData = {
    labels: ["Day", "Week", "Month", "Year"],
    datasets: [
      {
        label: "Total Transactions",
        data: [10, 20, 1, 50],
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
              {userDetails?.result?.balance || "Loading..."}
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
          <span>Transaction History</span>
        </div>

        <div className="overflow-x-auto">

          <TransactionHistory />

        </div>
      </div>
    </div>
  );
};

export default Wallet;
