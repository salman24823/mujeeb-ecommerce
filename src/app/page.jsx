"use client";

import { Button, Spinner } from "@nextui-org/react";
import { Key, Eye, EyeOff, Mail, User } from "lucide-react"; // Import the necessary icons
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import Logo from "@/../../public/logo.png"
import Image from "next/image";

export default function Home() {

  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // session data 
  const { data: session } = useSession();

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleForget = () => {
    try {

      if (username == "admin") {
        alert("You are Not an Admin.");
        return;
      }
      if (!username) {
        toast.error("Please enter your username.");
        return;
      }

      const response = fetch("/api/forgetAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      response.then((res) => {
        if (res.ok) {
          toast.success("An email has been sent to your registered email address with instructions to reset your password.");
        } else {
          toast.error("Failed to send reset instructions. Please try again.");
        }
      });

    } catch (error) {
      toast.error("An error occurred while processing your request.");
    }
  }

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();

    if (username == "admin") {
      alert("You are Not an Admin.");
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
        toast.error("Error in login: Invalid Email or Password");
      } else {
        toast.success("Login Successful.");
        if (session?.user?.status === "pending") {
          window.location.replace("/pending");
        } else if (session?.user?.status === "activated") {
          window.location.replace("/panel/wallet");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 h-screen gap-12 w-full bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 flex flex-col items-center justify-center">
      <div className="w-full sm:w-96 bg-gray-900 rounded-3xl px-8 max-md:px-4 py-10 shadow-2xl border border-gray-700">
        {/* <h2 className="text-xl font-semibold text-white mb-8 text-center"> */}
        <div className="flex justify-center mb-5 opacity-80">
          <Image src={Logo} alt="Logo" width={50} />
        </div>
        {/* </h2> */}

        {/* email Input */}
        <div className="relative mb-4">
          <User className="absolute max-md:w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

          <input
            type="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            className="max-md:text-sm w-full max-md:pl-10 pl-12 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <Key className="max-md:w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
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

        <Button
          aria-label="Login"
          className="w-full max-md:p-5 p-6 font-semibold max-md:text-sm max-md:font-normal text-medium bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 rounded-lg transition duration-300 ease-in-out"
          onClick={handleCredentialsLogin}
        >
          {loading ? <Spinner color="white" /> : "Login"}
        </Button>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-400">Don't have an account? </span>
          <Link
            href="signup"
            className="text-indigo-400 hover:text-indigo-500 transition duration-300 ease-in-out"
          >
            Sign up
          </Link>
        </div>

        <p onClick={handleForget} className="text-gray-500 hidden text-center hover:cursor-pointer hover:text-white" >Forget Account</p>

      </div>

      <p className="max-md:px-3 max-md:text-sm text-center text-gray-400">
        Welcome back! Please enter your credentials to access your account.
      </p>

    </div>
  );
}
