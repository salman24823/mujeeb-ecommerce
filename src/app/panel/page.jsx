// import Link from 'next/link';
import React from "react";
import { Clock, Info, Link } from "lucide-react"; // Lucide icons
import { Button } from "@nextui-org/react";

const News = () => {

  const promoNews = [
    {
      title: "EBT NEW SEASON HOT!",
      date: "07.11.2024 02:27 PM",
      description: "LIMITED OFFER! BEST STATES! BEST VALID! HOT PRICE $35",
      base: "ebt-hot-season-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.cc", text: "bigfat.cc" },
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
    {
      title: "507719 EBT PROMO!",
      date: "07.11.2024 01:28 PM",
      description: "DROP PRICE! 507719 EBT! GOOD BIN! CHEAP PRICE $25",
      base: "507719-ebt-promo-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
    {
      title: "508147 EBT PROMO!",
      date: "07.11.2024 12:51 PM",
      description: "DROP PRICE! 508147 EBT! GOOD BIN! CHEAP PRICE $25",
      base: "508147-ebt-promo-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
    {
      title: "EBT NEW SEASON HOT!",
      date: "07.11.2024 02:27 PM",
      description: "LIMITED OFFER! BEST STATES! BEST VALID! HOT PRICE $35",
      base: "ebt-hot-season-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.cc", text: "bigfat.cc" },
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
    {
      title: "EBT NEW SEASON HOT!",
      date: "07.11.2024 02:27 PM",
      description: "LIMITED OFFER! BEST STATES! BEST VALID! HOT PRICE $35",
      base: "ebt-hot-season-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.cc", text: "bigfat.cc" },
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
    {
      title: "EBT NEW SEASON HOT!",
      date: "07.11.2024 02:27 PM",
      description: "LIMITED OFFER! BEST STATES! BEST VALID! HOT PRICE $35",
      base: "ebt-hot-season-11-07-2024",
      telegram: "@bigfatofficial",
      links: [
        { href: "https://bigfat.cc", text: "bigfat.cc" },
        { href: "https://bigfat.pro", text: "bigfat.pro" },
        { href: "https://bigfat.domains", text: "bigfat.domains" },
        { href: "https://bigfat.links", text: "bigfat.links" },
      ],
    },
  ];

  return (
    <div className="w-full h-full text-white p-3 space-y-6">
      {/* Title */}
      <div className="text-xl font-semibold flex items-center space-x-2">
        <h1>NEW OFFICIAL UPDATE CHANNEL</h1>
        <Link className="text-indigo-500" />
      </div>

      <div className="space-y-6">
      {promoNews.map((promo, index) => (
        <div key={index} className="border border-slate-600 rounded-lg p-6 bg-gray-900 space-y-4">
          {/* Promo Title and Date */}
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-green-400">{promo.title}</div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Clock className="text-gray-500" size={16} />
              <span>{promo.date}</span>
            </div>
          </div>

          {/* Promo Description */}
          <p className="text-lg text-gray-200 mt-4">
            <span className="font-semibold text-white">Description:</span> {promo.description}
          </p>

          {/* Promo Base */}
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold">Base:</span> {promo.base}
          </p>

          {/* Telegram Section */}
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-blue-500">{promo.telegram}</span>
          </div>

          {/* Links Section */}
          <div className="space-y-2 mt-4">
            {promo.links.map((link, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Link className="text-blue-400" size={20} />
                <a href={link.href} className="text-blue-400 hover:text-blue-500">
                  {link.text}
                </a>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4">
            <Info className="text-yellow-500" size={20} />
            <span>For more information, check the official update channel!</span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default News;
