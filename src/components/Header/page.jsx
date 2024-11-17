"use client";

import React from "react";
import { UserRound } from "lucide-react";

const Header = () => {
  
  // const [currentPath, setCurrentPath] = useState("");

  // useEffect(() => {
  //   // Whenever the route changes, update the state
  //   setCurrentPath(window.location.pathname);
  //   console.log(currentPath,"current path")

  // }, [window.location.pathname]);


  // Define the title based on the current URL path
  // const getTitle = () => {
  //   switch (currentPath) {
  //     case "/panel":
  //       return "News";
  //     case "/panel/cart":
  //       return "Cart";
  //     case "/panel/change-password":
  //       return "Change Password";
  //     case "/panel/dumps-no-pin":
  //       return "Dumps without Pin";
  //     case "/panel/dumps-with-pin":
  //       return "Dumps with Pin";
  //     case "/panel/purchases":
  //       return "My Purchase History";
  //     case "/panel/support":
  //       return "Support";
  //     case "/panel/wallet":
  //       return "My Wallet";
  //     default:
  //       return "Error"; // Default title for unmatched paths
  //   }
  // };

  return (
    <div className="bg-gray-900 border-b flex border-gray-700 h-14">
      <div className="w-64 px-2 text-gray-500 gap-2 flex items-center h-full">
        <UserRound size={24} className="text-gray-500" />
        <p className="text-gray-500">Lorem Ipsum</p>

      </div>

      {/* <div className="flex-1 flex items-center justify-center text-xl font-semibold">
        <h1 className="text-gray-200">{getTitle()}</h1>
        <h1 className="text-gray-200"> {currentPath} </h1>
      </div> */}
    </div>
  );
};

export default Header;