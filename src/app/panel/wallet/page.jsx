import React from 'react';
import { Button } from '@nextui-org/react';  // Assuming you're using NextUI buttons

const Wallet = () => {
  return (
    <div className="w-full h-full bg-gray-800 text-white p-6">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4">Your Wallet</h1>
      
      {/* Description */}
      <p className="text-lg text-gray-400 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet itaque vel laboriosam eaque eveniet suscipit quidem corrupti et possimus maxime!.
      </p>
      
      {/* Buttons */}
      <div className="flex space-x-4">
        <Button
          aria-label="Read More"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
        >
          Read More
        </Button>
        <Button
          aria-label="Subscribe"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
        >
          Wallet
        </Button>
      </div>
    </div>
  );
};

export default Wallet;
