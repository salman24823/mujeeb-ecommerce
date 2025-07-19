import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 px-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-green-500 w-full max-w-md px-8 py-10 text-center">
        
        {/* Logo Placeholder */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">COM-UK</h2>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-semibold text-green-500 mb-4">
          Payment Request Received!
        </h1>

        <p className="text-gray-400 mb-8">
          Your payment request has been successfully submitted. We will process it shortly and notify you once it's completed.
        </p>

        {/* Call-to-Action */}
        <div className="space-y-4">
          <a
            href="/panel/wallet"
            className="block w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Go to Dashboard
          </a>
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
