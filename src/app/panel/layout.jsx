"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";

const Layout = ({ children }) => {
  const pathname = usePathname();

  const routes = [
    { name: "News", path: "/panel" },
    { name: "Wallet", path: "/panel/wallet" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 text-gray-400 py-4">
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
                      ? "w-full font-semibold text-blue-600 bg-gray-800 border-r-4 border-blue-500"
                      : "text-gray-400 w-full"
                  }`}
                >
                  {route.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </aside>

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
