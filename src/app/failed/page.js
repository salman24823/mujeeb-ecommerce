"use client";

import Link from "next/link";

export default function FailedTransactionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 px-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-red-500 w-full max-w-md px-8 py-10 text-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Website Logo</h2>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-semibold text-red-500 mb-4">
          Transaction Failed
        </h1>
        <p className="text-gray-400 mb-8">
          Unfortunately, your payment request could not be processed. Please try again or contact support for assistance.
        </p>

        {/* Suggested Actions */}
        <div className="space-y-4">
          <Link
            href="/panel/wallet"
            className="block w-full px-6 py-3 bg-transparent border border-green-500 text-green-500 font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Retry Payment
          </Link>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        <p>
          Need help?{" "}
          <Link
            href="/support"
            className="text-indigo-400 hover:text-indigo-500 transition duration-300"
          >
            Contact Support
          </Link>
        </p>
      </footer>
    </div>
  );
}
