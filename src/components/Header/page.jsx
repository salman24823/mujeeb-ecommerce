import { UserRound } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="bg-gray-900 border-b border-gray-700 h-14">
      <div className="w-64 px-2 text-gray-500 gap-2 flex items-center h-full">
        <UserRound />
        <p className="text-gray-500">Lorem Ipsum</p>
      </div>

      <div>ABC</div>
    </div>
  );
};

export default Header;
