"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

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
      name: "Cart",
      path: "/panel/cart",
      icon: <ShoppingCart className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Purchases",
      path: "/panel/purchases",
      icon: <ClipboardEditIcon className="w-5 h-5 text-gray-500" />,
    },
    // {
    //   name: "Support",
    //   path: "/panel/support",
    //   icon: <HelpCircle className="w-5 h-5 text-gray-500" />,
    // },
    {
      name: "Change Password",
      path: "/panel/change-password",
      icon: <Lock className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Sign out",
      path: "/",
      icon: <LogOut className="w-5 h-5 text-gray-500" />,
      onClick: () => signOut(),
    },
  ];

  return (
    <div className="flex bg-gray-900">
      {/* Conditionally render Sidebar */}
      {pathname !== "/panel/change-password" && (
        <aside
          className={`lg:w-64 w-2/3 h-screen pt-4 border-r max-[770px]:p-0 border-gray-700 bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                    className={`text-start block p-3 ${
                      pathname === route.path
                        ? "w-full font-semibold text-blue-600 flex gap-3 bg-gray-800 border-r-4 border-blue-500"
                        : "text-gray-400 flex gap-3 w-full"
                    }`}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-[92vh] max-[770px]:p-3 overflow-y-scroll w-full p-6 bg-gray-800 relative">
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
  );
};

export default Layout;
