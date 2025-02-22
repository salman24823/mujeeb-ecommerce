"use client";

import { useEffect, useState } from "react";

const AdminQueries = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyData, setReplyData] = useState({});

  async function fetchQueries() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/submitForm");
      if (!response.ok) throw new Error("Failed to fetch queries");

      const data = await response.json();
      setFormData(data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitReply(id) {
    try {
      if (!replyData[id]) return;

      const response = await fetch("/api/submitForm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reply: replyData[id] }),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      fetchQueries(); // Refresh data after replying
      setReplyData({ ...replyData, [id]: "" }); // Clear reply input
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  }

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-gray-900 border border-slate-700 rounded-lg shadow-xl">
      <h2 className="text-2xl text-indigo-500 mb-6">Admin Panel - Manage Queries</h2>

      {loading ? (
        <p className="text-gray-400">Loading queries...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : formData.length > 0 ? (
        formData 
        .slice() // Create a copy of the array to avoid mutating the original
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
        .map((data) => (
          <div key={data._id} className="bg-gray-800 p-4 mb-6 rounded-lg shadow-sm">
            <p className="text-indigo-400">Query from: {data.name}</p>
            <p className="text-gray-300">Subject: {data.subject || "No Subject"}</p>
            <p className="text-gray-300">Message: {data.message}</p>

            {data.reply ? (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <p className="text-green-400">Admin Reply:</p>
                <p className="text-gray-300">{data.reply}</p>
              </div>
            ) : (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Type your reply..."
                  value={replyData[data._id] || ""}
                  onChange={(e) => setReplyData({ ...replyData, [data._id]: e.target.value })}
                />
                <button
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                  onClick={() => submitReply(data._id)}
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No queries found.</p>
      )}
    </div>
  );
};

export default AdminQueries;
