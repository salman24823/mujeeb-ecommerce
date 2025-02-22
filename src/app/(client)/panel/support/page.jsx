"use client";

import React, { useState, useEffect } from "react";
import { Headset, MessageCircleMore, MessageSquareText } from "lucide-react";
import SubmitModel from "./submitModal";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
    userID: "",
  });

  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [myID, setMYID] = useState(null); // Set initial value to null

  const { data: session } = useSession();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch replies based on user ID
  const fetchReplies = async () => {
    if (!myID) return; // Don't proceed if myID is not available

    try {
      setLoading(true);
      const response = await fetch("/api/fetchReplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myID }),
      });

      if (!response.ok) console.error(response.error, "Error fetching replies");

      const data = await response.json();
      console.log(data.result, "Replies Data");
      // Assuming the replies are in the 'data.result' property
      setReplies(data.result); // Update state with fetched replies
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData, myID, "formData , myID ");

      setLoading(true);
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) throw new Error("Failed to submit query");

      setFormData({ name: "", subject: "", message: "", userID: "" });

      fetchReplies(); // Refresh replies after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        userID: session.user.id,
      }));
    }
    setMYID(session?.user?.id);
  }, [session]);

  useEffect(() => {
    if (myID) {
      fetchReplies(); // Fetch replies when myID is set
    }
  }, [myID]);

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Support Form Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-2xl mb-6 flex items-center space-x-2">
          <Headset size={24} />
          <span>Submit Your Query</span>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm text-gray-400 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter the subject of your query"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm text-gray-400 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Describe your issue or inquiry"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="5"
              required
            />
          </div>

          <SubmitModel formData={formData} loading={loading} />
        </form>
      </div>

      {/* Replies Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        {/* Header Section */}
        <div className="text-indigo-400 text-2xl mb-6 flex items-center space-x-3">
          <MessageCircleMore size={28} className="text-indigo-400" />
          <span className="font-semibold">Replies from Admin</span>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          {replies.length !== 0 ? (
            replies
              .slice() // Create a copy of the array to avoid mutating the original
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
              .map((value, index) => (
                <div
                  key={index} // Add a key for React list rendering
                  className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400 transition-all duration-200"
                >
                  <p className="text-white font-medium text-lg mb-2">
                    Subject: {value.subject}
                  </p>
                  <p className="text-gray-300 text-sm mb-2">
                    Reply: {value.reply}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(value.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No replies yet. Loading...
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Support;
