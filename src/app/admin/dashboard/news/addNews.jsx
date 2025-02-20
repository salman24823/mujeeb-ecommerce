"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Plus } from "lucide-react";

// React component
export default function AddNews({ setNewsData }) {
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [links, setLinks] = useState([""]); // Array to store links
  const [title, setTitle] = useState(""); // News title state
  const [description, setDescription] = useState(""); // News description state
  const [error, setError] = useState(""); // Error message state

  // const onOpen = () => setIsOpen(true); 
  const onClose = () => setIsOpen(false); // Close modal

  // Handle adding a new link input field
  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  // Handle link input change
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!title || !description || links.length === 0) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/handleNews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsTitle: title,
          newsDescription: description,
          newsLinks: links,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNews = await response.json();

      setNewsData(updatedNews)

      // Reset form
      setTitle("");
      setDescription("");
      setLinks([""]);
      setError("");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error adding news:", error);
      setError("Failed to add news. Please try again.");
    }
  };

  return (
    <>
      <button
        className="bg-green-500 fixed flex justify-center items-center bottom-6 right-10 w-20 h-20 max-[770px]:bottom-2 rounded-full max-[770px]:right-2 z-10 max-[770px]:w-12 max-[770px]:h-12"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="text-black text-3xl" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent className="bg-gray-900 text-gray-100">
          <ModalHeader className="text-center">
            <h2 className="text-xl font-semibold text-gray-100">
              Add News Details
            </h2>
          </ModalHeader>

          <ModalBody>
            {/* Title input */}
            <input
              placeholder="Enter News Title"
              type="text"
              className="w-full p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-gray-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* Description input */}
            <input
              placeholder="Enter News Description"
              type="text"
              className="w-full p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-gray-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Link inputs */}
            {links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  placeholder={`Enter Link ${index + 1}`}
                  type="text"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-gray-100"
                />
                {links.length > 1 && (
                  <Button
                    auto
                    color="error"
                    onPress={() => {
                      const updatedLinks = links.filter((_, i) => i !== index);
                      setLinks(updatedLinks);
                    }}
                    className="text-white rounded-md"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button
              color="gradient"
              variant="flat"
              onPress={handleAddLink}
              className="w-full py-3 bg-green-800 rounded-md text-white font-semibold hover:bg-green-600 transition-colors duration-300 ease-in-out"
            >
              Add Another Link
            </Button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </ModalBody>

          <ModalFooter>
            <form onSubmit={handleSubmit}>
              {" "}
              {/* Wrap the submit button inside a form */}
              <Button
                type="submit" // Change to `type="submit"`
                color="gradient"
                variant="flat"
                className="w-full py-3 rounded-md text-white bg-blue-600 font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out"
              >
                Publish
              </Button>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
