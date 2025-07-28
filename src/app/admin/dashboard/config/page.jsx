"use client";
import { useEffect, useState } from "react";

export default function AdminConfigPage() {
  const [env, setEnv] = useState({});
  const [loading, setLoading] = useState(true);

  // List of sensitive fields that shouldn't be editable
  const SENSITIVE_FIELDS = ['MONGODB_URI', 'DB_URI', 'DATABASE_URL', 'MONGO_URI'];

  useEffect(() => {
    fetch("/api/admin-config")
      .then((res) => res.json())
      .then((data) => {
        setEnv(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setEnv({ ...env, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(env),
    });
    const data = await res.json();
    alert(data.message);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-green-400 flex items-center justify-center">
      <div className="animate-pulse flex items-center space-x-4">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <p className="text-lg">Loading environment variables...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Environment Configuration</h1>
          <div className="h-1 w-20 bg-green-500 rounded-full"></div>
          <p className="text-gray-400 mt-2">Edit your application environment variables</p>
          {/* <p className="text-yellow-400 text-sm mt-2">
            Note: Sensitive database connections cannot be modified here
          </p> */}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(env)
            .filter(key => !SENSITIVE_FIELDS.includes(key)) // Filter out sensitive fields
            .map((key) => (
              <div key={key} className="bg-gray-800 rounded-lg p-5 shadow-lg">
                <label className="block text-sm font-medium text-green-400 mb-2">
                  {key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={env[key] || ""}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 
                            text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                            focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            ))}
          
          {/* Display read-only sensitive fields */}
          {/* {Object.keys(env)
            .filter(key => SENSITIVE_FIELDS.includes(key))
            .map((key) => (
              <div key={key} className="bg-gray-800 rounded-lg p-5 shadow-lg border border-gray-700">
                <label className="block text-sm font-medium text-green-400 mb-2">
                  {key} <span className="text-yellow-400 text-xs">(read-only)</span>
                </label>
                <input
                  type="password"
                  value="••••••••••••••••••••••••"
                  readOnly
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 
                            text-gray-500 cursor-not-allowed"
                />
              </div>
            ))} */}
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-8 rounded-md
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400
                        focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}