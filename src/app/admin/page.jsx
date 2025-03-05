"use client"

import { Button, Spinner } from "@nextui-org/react";
import { Key, Eye, EyeOff, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();

    if (username !== "admin") {
      alert("Are Trying to login as user instead of Admin ?");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {

      // Use NextAuth to sign in
      const loginRes = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false, // Don't auto redirect
      });

      if (loginRes?.error) {
        // Show error alert if login failed
        toast.error("Error in login: Invalid Email or Password");
      } else {
        // Success, show success alert and redirect
        toast.success("Login successful!");
        router.push("/admin/dashboard"); // Navigate to dashboard
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 h-screen gap-12 w-full bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 flex flex-col items-center justify-center">
      <div className="w-full sm:w-96 bg-gray-900 rounded-3xl px-8 max-md:px-4 py-10 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-8 text-center">
          Website Logo Here!
        </h2>

        {/* Email Input */}
        <div className="relative mb-4">
          <Mail className="absolute max-md:w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <Key className="max-md:w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={passwordVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="max-md:w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <Button
          aria-label="Login"
          className="w-full max-md:p-5 p-6 font-semibold max-md:text-sm max-md:font-normal text-medium bg-green-800 hover:bg-green-700 active:bg-green-800 text-white px-6 rounded-lg transition duration-300 ease-in-out"
          onClick={handleCredentialsLogin}
        >
          {loading ? <Spinner color="white" /> : "Login As Admin"}
        </Button>
      </div>

      <p className="max-md:px-3 max-md:text-sm text-center text-gray-400">
        Are You Facing any Issue or Want some Changes in your site?{" "}
        <a className="text-blue-500 underline" href="#">
          Contact
        </a>{" "}
        your Developers
      </p>
    </div>
  );
}
