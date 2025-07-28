"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";
import { CreditCard, LogOut, Globe, User2, Newspaper, SidebarCloseIcon, SidebarOpen } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdCreditCardOff, MdSupport } from "react-icons/md";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
    useEffect(() => {
      if (session?.user?.email !== "admin@gmail.com") {
        alert("Not Authenticated")
        location.replace("/admin")
  
        return ""
      } 
    }, [session]);

  // State for controlling the sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: <Globe className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "News",
      path: "/admin/dashboard/news",
      icon: <Newspaper className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Users",
      path: "/admin/dashboard/users",
      icon: <User2 className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Dumps with Pins",
      path: "/admin/dashboard/dumpsWithPins",
      icon: <CreditCard className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Dumps No Pins",
      path: "/admin/dashboard/dumpsNoPins",
      icon: <MdCreditCardOff className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Queries",
      path: "/admin/dashboard/queries",
      icon: <MdSupport className="w-5 h-5 text-gray-500" />,
    },
    {
      name: "Sign out",
      path: "/",
      icon: <LogOut className="w-5 h-5 text-gray-500" />,
      onClick: () => signOut(),
    },
  ];

  return (
    <div className="flex h-full bg-gray-900">
      {/* Conditionally render Sidebar */}
      {pathname !== "/admin/dashboard/change-password" && (
        <aside
          className={`md:!sticky border-r md:border-0 border-gray-700 md:h-fit top-0 h-full lg:w-64 w-2/3 max-[770px]:p-0 bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static top-0 left-0 z-10 lg:z-auto`} >
          <ul>
            <li className="px-[0.6rem] py-4 mb-4 border-b border-gray-700">
              <h1>Admin Dashboard</h1>
            </li>
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
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-scroll w-full p-6 bg-gray-800 relative">
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
