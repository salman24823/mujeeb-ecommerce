"use client";

import React, { useState, useEffect } from "react";
import { User2 } from "lucide-react";

const Purchases = () => {
  
  // Fixing initial state of Users (should be an array)
  const [Users, setUsers] = useState([ ]);

    // Fetch the news data from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/fetchUsers");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);

        console.log(Users,"Users")
        console.log(data,"data")
        
      } catch (error) {
        console.error("Error fetching users:", error);
      } 
    };

  useEffect(() => {
    fetchUsers()
  }, []);

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">


     
      {/* Table Section */}
      <div className="overflow-x-scroll bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        
        <div className="text-indigo-500 text-xl mb-4 flex items-center space-x-2">
          <User2 size={24} />
          <span>All Users</span>
        </div>

        <table className=" min-w-full text-sm text-gray-400">
          {/* Table Headings */}
          <thead>
            <tr className="border-b border-gray-700">
              <td className="py-3 px-6 text-nowrap  text-left text-sm font-semibold text-gray-300">User Name</td>
              <td className="py-3 px-6 text-nowrap  text-left text-sm font-semibold text-gray-300">Email</td>
              <td className="py-3 px-6 text-nowrap  text-left text-sm font-semibold text-gray-300">Joining Date</td>
              <td className="py-3 px-6 text-nowrap  text-left text-sm font-semibold text-gray-300">Current Balance</td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody >
            {Users.map((User, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-gray-900 }`}
              >
                <td className="py-3 px-6 text-nowrap ">{User.username}</td>
                <td className="py-3 px-6 text-nowrap ">{User.email}</td>
                <td className="py-3 px-6 text-nowrap ">{User.createdAt}</td>
                <td className="py-3 px-6 text-nowrap ">{User.balance || "Loading..." }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
