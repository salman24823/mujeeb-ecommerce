"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@nextui-org/react';

const layout = ({ children }) => {

  const pathname = usePathname();

  const routes = [
    { name: "News", path: "/panel" },
    { name: "Wallet", path: "/panel/wallet" },
  ];

  return (
    <div className="flex">
      <aside className="w-64 bg-white border-r border-gray-300 text-gray-700 py-4">
        <ul>
          {routes.map((route) => (
            <li key={route.path}>
              <Button
                className="p-0 w-full bg-white relative cursor-pointer hover:bg-slate-100 transition-all duration-300 ease-in-out text-blue-500"
                radius="none"
              >
                <Link
                  href={route.path}
                  className={`text-start block p-3 ${
                    pathname === route.path
                      ? "w-full font-semibold text-blue-600 bg-slate-50 border-r-4 border-blue-500"
                      : "text-gray-700 w-full"
                  }`}
                >
                  {route.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 w-full p-4 bg-slate-50 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial="hidden"
            animate="enter"
            exit="exit"
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default layout;
