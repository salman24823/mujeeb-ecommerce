"use client"

import { Button } from "@nextui-org/react";
import { User, Key, Eye, EyeOff } from 'lucide-react'; // Import the necessary icons
import { useState } from 'react';

export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
      <div className="w-full sm:w-96 bg-gray-900 rounded-3xl px-8 py-10 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-8 text-center">Website Logo Here !</h2>

        {/* Username Input */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
          {/* Eye Icon to toggle password visibility */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <Button
          aria-label="Login"
          className="w-full p-6 font-semibold text-medium bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 rounded-lg transition duration-300 ease-in-out"
        >
          Login
        </Button>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-400">Don't have an account? </span>
          <a
            href="#"
            className="text-indigo-400 hover:text-indigo-500 transition duration-300 ease-in-out"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
