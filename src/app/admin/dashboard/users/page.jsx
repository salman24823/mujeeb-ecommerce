"use client";

import React, { useState, useEffect } from "react";
import { User2 } from "lucide-react";

const Users = () => {
  const [Users, setUsers] = useState([]);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/fetchUsers");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user action (Suspend/Activate)
  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`/api/fetchUsers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update the state immediately
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: action } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      <div className="overflow-x-scroll bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-xl mb-4 flex items-center space-x-2">
          <User2 size={24} />
          <span>All Users</span>
        </div>

        <table className="min-w-full text-sm text-gray-400">
          <thead>
            <tr className="border-b border-gray-700">
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                User Name
              </td>
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                Email
              </td>
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                Joining Date
              </td>
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                Current Balance
              </td>
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                Status
              </td>
              <td className="py-3 px-6 text-nowrap text-left font-semibold text-gray-300">
                Action
              </td>
            </tr>
          </thead>

          <tbody>
            {Users.map((User) => (
              <tr
                key={User._id}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-gray-900"
              >
                <td className="py-3 px-6 text-nowrap">{User.username}</td>
                <td className="py-3 px-6 text-nowrap">{User.email}</td>
                <td className="py-3 px-6 text-nowrap">{User.createdAt}</td>
                <td className="py-3 px-6 text-nowrap">
                  {User.balance || "Loading..."}
                </td>
                <td className="py-3 px-6 text-nowrap">{User.status}</td>
                <td className="py-3 px-6 text-nowrap">
                  {User.status === "activated" ? (
                    <button
                      onClick={() => handleUserAction(User._id, "inactive")}
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUserAction(User._id, "activated")}
                      className="bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
