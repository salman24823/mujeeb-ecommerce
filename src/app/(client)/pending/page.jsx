"use client";

import React from 'react';
import { AlertCircle, RefreshCw, LogOut, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

const Pending = () => {

  function logout() {
    // Call signOut and wait for it to complete
    signOut({
      redirect: true, // Ensure redirection after logout
      callbackUrl: "/", // Redirect to home page or any desired URL after sign out
    })
      .then(() => {
        toast.success("Logout Successful. Redirecting...");
      })
      .catch((error) => {
        toast.error("An error occurred while logging out. Please try again.");
        console.error("Logout error:", error); // Log error for debugging
      });
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg shadow-gray-900/50 text-center border border-gray-700 transition-all duration-300">
        <div className="mb-6 flex justify-center animate-pulse">
          <div className="p-3 rounded-full bg-green-900/20">
            <AlertCircle className="w-14 h-14 text-green-400" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-100 mb-3">
          Account Pending Approval
        </h1>
        <p className="text-gray-300 mb-6">
          Your account is under review. We'll notify you once approved for full access.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-gray-200 hover:bg-gray-700/80 rounded-md transition-all duration-200 border border-gray-600 hover:shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            className="inline-flex items-center text-sm text-green-400 hover:text-green-300 hover:underline"
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Contact Support
          </a>
          <p className="mt-3 text-xs text-gray-400">
            Typically takes 1-2 business days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pending;