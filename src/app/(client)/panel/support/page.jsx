"use client";

import React, { useState } from "react";
import { Headset, MessageCircleMore, MessageSquareText } from "lucide-react";
import SubmitModel from "./submitModal";

const Support = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const [replies, setReplies] = useState([
    {
      admin: "Admin",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, eaque! Dolore sunt error porro ipsum unde corporis esse!",
    },
  ]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with: ", formData);
    // Simulate an admin reply after submitting the form
    setReplies((prev) => [
      ...prev,
      {
        admin: "Admin",
        message: `Thank you, ${formData.name}. We've received your message and are processing it.`,
      },
    ]);
    setFormData({
      name: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      {/* Title and Header */}
      {/* <div className="text-xl font-semibold flex items-center space-x-2">
        <h1 className="text-gray-200">Support Channel</h1>
      </div> */}

      {/* Support Form Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-2xl mb-6 flex items-center space-x-2">
          <Headset size={24} />
          <span>Submit Your Query</span>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
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
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              required
            />
          </div>

          {/* Subject Field */}
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
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              required
            />
          </div>

          {/* Message Field */}
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
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              rows="5"
              required
            />
          </div>

          {/* Submit Button */}
          <SubmitModel formData={formData} />
        </form>
      </div>

      {/* Admin Replies Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-2xl mb-4 flex items-center space-x-2">
          <MessageCircleMore size={24} />
          <span>Replies from Admin</span>
        </div>

        <div className="space-y-6">
          {replies.map((reply, index) => (
            <div
              key={index}
              className="bg-gray-800 mt-10 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <MessageSquareText className="text-indigo-500" />
                <div className="text-sm text-indigo-400">{reply.admin}</div>
              </div>
              <p className="text-gray-300 mt-2">{reply.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
