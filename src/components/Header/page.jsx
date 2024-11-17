"use client";

import React, { useEffect, useState } from "react";
import {
  Clipboard,
  ClipboardEditIcon,
  CreditCard,
  Headset,
  Home,
  ShoppingCart,
  UserRound,
  Wallet,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { MdOutlineCreditCardOff } from "react-icons/md";

const Header = () => {
  const pathname = usePathname();

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const url = pathname;

    console.log(url);

    setCurrentPath(url);
    console.log(url, "current path");
  }, [pathname]);

  // Define the title based on the current URL path
  const getTitle = () => {
    let title;
    let Icon;

    switch (currentPath) {
      case "/panel":
        title = "News";
        Icon = Home; // Example icon for "News"
        break;
      case "/":
        title = "";
        Icon = null; // No icon
        break;
      case "/panel/cart":
        title = "Cart";
        Icon = ShoppingCart;
        break;
      case "/panel/cvv":
        title = "CVV";
        Icon = CreditCard; // Example icon for "CVV"
        break;
      case "/panel/change-password":
        title = "";
        Icon = null; // No icon
        break;
      case "/panel/dumps-no-pin":
        title = "Dumps without Pin";
        Icon = MdOutlineCreditCardOff; // Example icon for "Dumps without Pin"
        break;
      case "/panel/dumps-with-pin":
        title = "Dumps with Pin";
        Icon = Clipboard; // Example icon for "Dumps with Pin"
        break;
      case "/panel/purchases":
        title = "My Purchase History";
        Icon = ClipboardEditIcon; // Example icon for "Purchase History"
        break;
      case "/panel/support":
        title = "Support";
        Icon = Headset; // Example icon for "Support"
        break;
      case "/panel/wallet":
        title = "My Wallet";
        Icon = Wallet;
        break;
      default:
        title = "";
        Icon = null; // Default case, no icon
    }
  };

  return (
    <div className="bg-gray-900 border-b flex border-gray-700 h-[8vh]">
      <div className="w-64 px-2 text-gray-500 gap-2 flex items-center h-full">
        <UserRound size={24} className="text-gray-500" />
        <p className="text-gray-500">Lorem Ipsum</p>
      </div>

      <div className="gap-3 flex items-center text-xl font-semibold">
        {Icon && <Icon className="mr-2 text-indigo-600" />}
        <h1 className="text-gray-200">{getTitle()}</h1>
      </div>
    </div>
  );
};

export default Header;
