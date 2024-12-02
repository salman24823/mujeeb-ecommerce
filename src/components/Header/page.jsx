"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarOpenIcon,
  // Clipboard,
  // ClipboardEditIcon,
  // CreditCard,
  // Headset,
  // Home,
  // ShoppingCart,
  UserRound,
  // Wallet,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// import { MdOutlineCreditCardOff } from "react-icons/md";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const url = pathname;

    console.log(url);

    setCurrentPath(url);
    console.log(url, "current path");
  }, [pathname]);

  // Define the title based on the current URL path
  const getTitle = () => {
    // let title;
    // let Icon;

    switch (currentPath) {
      case "/panel":
        return "News";
      // Icon = Home; // Example icon for "News"
      // break;
      case "/":
        return "";
      // Icon = null; // No icon
      // break;
      case "/panel/cart":
        return "Cart";
      // Icon = ShoppingCart;
      // break;
      case "/panel/cvv":
        return "CVV";
      // Icon = CreditCard; // Example icon for "CVV"
      // break;
      case "/panel/change-password":
        return "";
      // Icon = null; // No icon
      // break;
      case "/panel/dumps-no-pin":
        return "Dumps without Pin";
      // Icon = MdOutlineCreditCardOff; // Example icon for "Dumps without Pin"
      // break;
      case "/panel/dumps-with-pin":
        return "Dumps with Pin";
      // Icon = Clipboard; // Example icon for "Dumps with Pin"
      // break;
      case "/panel/purchases":
        return "My Purchase History";
      // Icon = ClipboardEditIcon; // Example icon for "Purchase History"
      // break;
      case "/panel/support":
        return "Support";
      // Icon = Headset; // Example icon for "Support"
      // break;
      case "/panel/wallet":
        return "My Wallet";
      // Icon = Wallet;
      // break;
      default:
        return "";
      // Icon = null; // Default case, no icon
    }
  };

  return (
    <div className="bg-gray-900 border-b z-10 h-14 top-0 fixed w-full flex border-gray-700">

      <div className="w-64 max-[770px]:w-1/2 px-2 text-gray-500 gap-2 flex items-center h-full">
        <UserRound
          onClick={() => location.replace("/panel/wallet")}
          size={24}
          className="hover:cursor-pointer text-gray-500"
        />
        <p className="text-gray-500">
          {session?.user?.username || "Loading..."}
        </p>
      </div>

      <div className="gap-3 max-[770px]:w-1/2 px-7 max-[770px]:px-3 flex items-center text-xl font-semibold">
        {/* {Icon && <Icon className="mr-2 text-indigo-600" />} */}
        <h1 className="text-gray-200 max-[770px]:w-full max-[770px]:text-sm text-end ">{getTitle()}</h1>
      </div>


    </div>
  );
};

export default Header;
