"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Key, Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const [newPassword, setNewPassword] = useState(""); // State for the new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for the confirm password
  const [passwordMatchError, setPasswordMatchError] = useState(false); // State for handling password mismatch error

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Validate if the passwords match
  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      return false;
    } else {
      setPasswordMatchError(false);
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate passwords before submitting
    if (validatePasswords()) {
      // If passwords match, you can proceed with submission (e.g., API call)
      console.log("Passwords match. Form submitted!");
    }
  };

  return (
    <>
      <div className="hero_area h-screen overflow-hidden space-y-8 flex justify-center max-w-screen-lg mx-auto px-4 py-8">
        <div className="w-2/5 h-screen bg-gray-900 border border-slate-700 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-300 mb-6 text-center">
            Change Your Password
          </h2>

          <form onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="relative mb-4">
              <Key
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  passwordMatchError && !newPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
              />
              
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-6">
              <Key
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  passwordMatchError
                    ? "focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error message for password mismatch */}
            {passwordMatchError && (
              <div className="text-red-500 text-sm mt-2">
                Passwords do not match. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <Button
              aria-label="Submit password change"
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition duration-300 ease-in-out mt-6"
            >
              Submit
            </Button>
          </form>
        </div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" />
            <use xlinkHref="#gentle-wave" x="48" y="3" />
            <use xlinkHref="#gentle-wave" x="48" y="5" />
            <use xlinkHref="#gentle-wave" x="48" y="7" />
          </g>
        </svg>

      </div>
    </>
  );
};

export default ChangePassword;