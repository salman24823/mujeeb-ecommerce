"use client"

import { Button } from "@nextui-org/react";
import { User, AtSign, Key, Eye, EyeOff } from 'lucide-react'; // Added AtSign icon for Email
import Link from "next/link";
import { useState } from 'react';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for toggling confirm password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  return (
    <div className="p-5 h-screen gap-12 w-full bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 flex flex-col items-center justify-center">
      <div className="w-full sm:w-96 bg-gray-900 rounded-3xl px-8 max-md:px-4 py-10 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-8 text-center">Website Logo Here !</h2>

        {/* Username Input */}
        <div className="relative mb-4">
          <User className="absolute max-md:w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <Key className="max-md:w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
          {/* Eye Icon to toggle password visibility */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="max-md:w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative mb-6">
          <Key className="max-md:w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
          {/* Eye Icon to toggle confirm password visibility */}
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="max-md:w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {confirmPasswordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Sign Up Button */}
        <Button
          aria-label="Sign Up"
          className="w-full max-md:p-5 p-6 font-semibold max-md:text-sm max-md:font-normal text-medium bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 rounded-lg transition duration-300 ease-in-out"
        >
          Sign Up
        </Button>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-400">Already have an account? </span>
          <Link
            href="/"
            className="text-indigo-400 hover:text-indigo-500 transition duration-300 ease-in-out"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
