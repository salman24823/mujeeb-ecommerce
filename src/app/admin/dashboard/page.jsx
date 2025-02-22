"use client";

import { Button, Spinner } from "@nextui-org/react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import {
  ArrowDownRight,
  CreditCard,
  HeadsetIcon,
  ShieldCheck,
  User2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { MdOutlineCreditCardOff, MdQuestionAnswer } from "react-icons/md";
import { toast } from "react-toastify";

const Overview = () => {
  const [USERS, setUSERS] = useState();
  const [orders, setOrders] = useState();

  const [queries, setQueries] = useState([]); // Stores all queries
  const [queryWithReply, setQuerywithReply] = useState([]); // Stores queries that have replies
  const [queryWithNoReply, setQueriewithNoReply] = useState([]); // Stores queries without replies

  // Registering chart.js components
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler
  );

  const [salesChartData, setSalesChartData] = useState({
    labels: ["Day", "Week", "Month", "Year"],
    datasets: [
      {
        label: "Transactions",
        data: [0, 0, 0, 0], // Placeholder for dynamic data
        fill: true,
        backgroundColor: "rgba(79, 70, 229, 0.3)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(79, 70, 229, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  });

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Overview: Daily, Weekly, Monthly, Yearly",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#FFFFFF", // White title text for contrast
      },
      datalabels: {
        color: "#FFFFFF", // Data label color for visibility on the line
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

  const { data: session } = useSession();

  // fetch users ok
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/fetchUsers", {
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors", // Add 'cors' mode
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();

      setUSERS(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/totalOrders", {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();

      const allProducts = data.flatMap((order) => order.products);

      console.log(allProducts.length, "All Products");

      setOrders(allProducts);

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("Invalid orders data (not an array):", data);
        return;
      }

      // Get current date details
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentWeek = getWeekNumber(now);

      let dailyCount = 0,
        weeklyCount = 0,
        monthlyCount = 0,
        yearlyCount = 0;

      data.forEach((order, index) => {
        if (!order.createdAt) {
          console.warn(
            `Skipping order ${index + 1} due to missing createdAt:`,
            order
          );
          return;
        }

        const orderDate = new Date(order.createdAt);

        if (isNaN(orderDate.getTime())) {
          console.warn(
            `Skipping order ${index + 1} due to invalid date:`,
            order.date
          );
          return;
        }

        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;
        const orderWeek = getWeekNumber(orderDate);
        const orderDay = orderDate.toISOString().split("T")[0];

        if (now - orderDate <= 86400000) dailyCount++; // Orders in last 24 hours
        if (orderYear === currentYear) yearlyCount++;
        if (orderMonth === currentMonth && orderYear === currentYear)
          monthlyCount++;
        if (orderWeek === currentWeek && orderYear === currentYear)
          weeklyCount++;
      });

      // Update sales chart dynamically
      setSalesChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [dailyCount, weeklyCount, monthlyCount, yearlyCount],
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      Math.round(
        ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      ) + 1
    );
  }

  async function handleQueries() {
    try {
      const response = await fetch("/api/handleQueries");
      if (!response.ok) {
        toast.error("Error in getting Queries");
        return;
      }

      const { data } = await response.json();

      // Queries with replies
      setQuerywithReply(
        data.filter((query) => query.reply && query.reply.trim() !== "")
      );

      // Queries without replies
      setQueriewithNoReply(
        data.filter((query) => !query.reply || query.reply.trim() === "")
      );

      console.log(data, "result query");

      setQueries(data);
    } catch (error) {
      console.log(error, "error from queries");
    }
  }

  useEffect(() => {
    handleQueries();
    fetchUsers();
    fetchOrders();
  }, []);

  return (
    <div className="w-full text-white space-y-8">

      {/* Header Section */}
      <div className="space-y-6">
        <div className="bg-gray-900 border gap-5 items-center flex border-slate-700 p-8 rounded-xl shadow-2xl max-[770px]:flex-col max-[770px]:text-center">
          <div className="w-24 h-24 bg-gray-950 rounded-full"></div>

          <div className="flex-1">
            <h1 className="text-green-400 text-3xl font-semibold">
              Welcome{" "}
              <span className="text-indigo-500">
                {" "}
                {session?.user?.username}{" "}
              </span>{" "}
              to Your Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and monitor everything happening on your site. Get detailed
              insights and make informed decisions with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid Section */}
      <div className="grid grid-cols-2 gap-4 max-[770px]:grid-cols-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-full flex justify-between">
              <h1 className="text-gray-500">Total Users</h1>
              <User2Icon className="text-gray-400" />
            </div>
            <h1 className="text-gray-100 text-3xl">
              {" "}
              {USERS ? USERS.length : <Spinner color="white" />}{" "}
            </h1>
          </div>

          <div className="bg-gray-900 border border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-full flex justify-between">
              <h1 className="text-gray-500">Total Sellings</h1>
              <CreditCard className="text-gray-400" />
            </div>
            <h1 className="text-gray-100 text-3xl">
              {" "}
              {orders ? orders.length : <Spinner color="white" />}{" "}
            </h1>
          </div>

          <div className="bg-gray-900 border border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-full flex justify-between">
              <h1 className="text-gray-500">Total Queries</h1>
              <HeadsetIcon className="text-gray-400 text-2xl" />
            </div>
            <h1 className="text-gray-100 text-3xl"> {queries ? queries.length : <Spinner color="white" />} </h1>
          </div>

          <div className="bg-gray-900 border border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-full flex justify-between">
              <h1 className="text-gray-500">Pending Queires</h1>
              <MdQuestionAnswer className="text-gray-400" />
            </div>
            <h1 className="text-gray-100 text-3xl"> {queryWithNoReply ? queryWithNoReply.length : <Spinner color="white" /> } </h1>
          </div>
        </div>

        <div className="bg-gray-900 border flex justify-between items-center border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <div className="h-full w-full">
            <Line
              className="w-full h-full"
              data={salesChartData}
              options={salesChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
