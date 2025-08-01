"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";
import { MdOutlineCreditCardOff } from "react-icons/md";

import {
  Home,
  Wallet,
  CreditCard,
  ShoppingCart,
  HelpCircle,
  Lock,
  LogOut,
  ClipboardEditIcon,
  SidebarCloseIcon,
  SidebarOpen,
  ShoppingBasket,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import Header from "@/app/components/Header/page";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // State for controlling the sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      name: "News",
      path: "/panel",
      icon: <Home className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Wallet",
      path: "/panel/wallet",
      icon: <Wallet className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Dumps With Pin",
      path: "/panel/dumps-with-pin",
      icon: <CreditCard className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Dumps No Pin",
      path: "/panel/dumps-no-pin",
      icon: <CreditCard className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "CVV",
      path: "/panel/#",
      icon: <CreditCard className="w-5 h-5 text-gray-500" />,
      commingSoon: <p className="px-2 border rounded-full bg-gray-700 border-gray-900">coming soon</p>
    },
    {
      name: "Pre Order",
      path: "/panel/#",
      icon: <ShoppingBasket className="w-5 h-5 text-gray-500" />,
      commingSoon: <p className="px-2 border rounded-full bg-gray-700 border-gray-900">coming soon</p>
    },
    {
      name: "Cart",
      path: "/panel/cart",
      icon: <ShoppingCart className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Purchases",
      path: "/panel/purchases",
      icon: <ClipboardEditIcon className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Support",
      path: "/panel/support",
      icon: <HelpCircle className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Change Password",
      path: "/panel/change-password",
      icon: <Lock className="w-5 h-5 text-gray-500" />,
    },
  ];

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
    <>
      <Header />
      <div className="flex h-screen md:relative pt-[52px] bg-gray-900">
        {/* Conditionally render Sidebar */}
        {pathname !== "/panel/change-password" && (
          <aside
            className={`md:!sticky border-r md:border-0 border-gray-700 md:top-[52px] md:h-fit top-0 h-full lg:w-64 w-2/3 pt-4 max-[770px]:p-0 bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 fixed lg:static top-0 left-0 z-10 lg:z-auto`}
          >
            <ul>
              <li
                className="hidden w-full p-[0.6rem] border-b border-gray-700 max-[770px]:flex justify-end"
                onClick={() => setSidebarOpen(false)}
              >
                <SidebarCloseIcon className="text-blue-500" />
              </li>
              {routes.map((route) => (
                <li key={route.path}>
                  <Button
                    className="p-0 w-full bg-gray-900 relative cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out text-blue-500"
                    radius="none"
                    onClick={route.onClick} // Attach the onClick handler here
                  >
                    <Link
                      href={route.path}
                      className={`text-start block p-3 ${pathname === route.path
                        ? "w-full font-semibold text-blue-600 flex gap-3 bg-gray-800 border-r-4 border-blue-500"
                        : "text-gray-400 flex gap-3 w-full"
                        }`}
                    >
                      {route.icon}
                      {route.name}
                      {route.commingSoon}
                    </Link>
                  </Button>
                </li>
              ))}
              <li>
                {/* <Link href="/"> */}
                <Button
                  className="w-full bg-gray-900 text-gray-400 flex justify-start p-3 font-md relative cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out"
                  radius="none"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                  Logout
                </Button>
                {/* </Link> */}
              </li>
            </ul>
          </aside>
        )}

        {/* Main Content Area */}
        <div className="border-l overflow-x-hidden border-gray-700 flex-1 max-[420px]-pb-20 max-[770px]:p-3 w-full p-6 bg-gray-800 relative">
          <div key={pathname} style={{ width: "100%" }}>
            {children}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-gray-700 hidden max-[770px]:block rounded-full p-3 text-white fixed bottom-2 left-2 hover:text-gray-300"
            >
              <SidebarOpen className="text-green-500" />
            </button>
          </div>
        </div>

      </div>
    </>

  );
};

export default Layout;
