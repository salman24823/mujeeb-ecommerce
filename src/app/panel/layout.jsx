"use client";

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
} from "lucide-react";

const Layout = ({ children }) => {
  const pathname = usePathname();

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
      icon: <MdOutlineCreditCardOff className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "CVV",
      path: "/panel/cvv",
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
      icon: <ShoppingCart className="w-5 h-5 text-gray-500" />,
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
    {
      name: "Sign out",
      path: "/panel/sign-out",
      icon: <LogOut className="w-5 h-5 text-gray-500" />,
    },
  ];

  return (
    <div className="flex bg-gray-900">
      {/* Conditionally render Sidebar */}
      {pathname !== "/panel/change-password" && (
        <aside className="w-64 h-screen pt-4 border-r border-gray-700 bg-gray-900 text-gray-400">
          <ul>
            {routes.map((route) => (
              <li key={route.path}>
                <Button
                  className="p-0 w-full bg-gray-900 relative cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out text-blue-500"
                  radius="none"
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
      <div className="flex-1 h-screen overflow-y-scroll w-full p-6 bg-gray-800 relative">
        <div
          key={pathname}
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
