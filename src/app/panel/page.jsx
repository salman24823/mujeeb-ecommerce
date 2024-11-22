"use client";

// import Link from 'next/link';
import { Spinner } from "@nextui-org/react";
import { Clock, LinkIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const News = () => {
  const [newsData, setNewsData] = useState([]); // State to store news data
  const [loading, setLoading] = useState(true); // State to track loading status

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/fetchNews");
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="w-full h-full text-white space-y-6">
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-6">
          {newsData.length === 0
            ? "No News Found Please Add news"
            : newsData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                .map((promo) => (
                  <div
                    key={promo._id} // Use _id from MongoDB as the key
                    className="border border-slate-700 rounded-lg p-6 bg-gray-900 space-y-4"
                  >
                    {/* Promo Title and Date */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <div className="text-2xl font-semibold text-green-400">
                          {promo.title}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Clock className="text-gray-500" size={16} />
                        <span>
                          {new Date(promo.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Promo Description */}
                    <p className="text-lg text-gray-200 mt-4">
                      <span className="font-semibold text-white">
                        Description:
                      </span>{" "}
                      {promo.description}
                    </p>

                    {/* Links Section */}
                    <div className="space-y-2 mt-4">
                      {promo.links.map((link, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <LinkIcon className="text-blue-400" size={20} />
                          <a
                            href={link}
                            className="text-blue-400 hover:text-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link}
                          </a>
                        </div>
                      ))}

                    </div>
                  </div>
                ))}
        </div>
      )}
    </div>
  );
};

export default News;
