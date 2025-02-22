"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import Papa from "papaparse";

export default function AddPins({ loadCSV }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Uploading...");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Uploading...",
        "Processing your file...",
        "Analyzing data structure...",
        "Fetching necessary details...",
        "Optimizing records...",
        "Verifying integrity...",
        "Ensuring accuracy...",
        "Refining data...",
        "Finalizing process...",
        "Almost there...",
        "Just a moment...",
        "All set! Wrapping up...",
      ];
      let index = 0;

      const interval = setInterval(() => {
        setLoadingMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const onClose = () => setIsOpen(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!file) {
      setError("Please upload a CSV file.");
      setLoading(false);
      return;
    }

    // Parse CSV file
    Papa.parse(file, {
      complete: async (result) => {
        console.log("Parsed CSV Data:", result.data); // Debugging

        if (!result.data || result.data.length < 1) {
          setError("CSV file is empty or incorrectly formatted.");
          setLoading(false);
          return;
        }

        const formattedData = result.data
          .slice(1) // Skip header row
          .map((row) => {
            if (!Array.isArray(row) || row.length < 1) return null;
            const [CARD,] = row.map((item) => item.trim());
            return CARD ? CARD : null;
          })
          .filter(Boolean);

        console.log("Formatted Data:", formattedData); // Debugging

        if (formattedData.length === 0) {
          setError("No valid data found in the CSV file.");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch("/api/handlePins/noPins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fieldsData: formattedData }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add Pins");
          }

          const data = response.json()

          console.log(data,"data")

          loadCSV();
          toast.success("Dumps added successfully");
          setFile(null);
          setError("");
          onClose();
        } catch (error) {
          console.error("Error adding dumps:", error);
          setError(error.message || "Failed to add Dumps. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      skipEmptyLines: true,
    });
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
              Upload CSV File
            </h2>
          </ModalHeader>

          <ModalBody>
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-gray-100"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onPress={handleSubmit}
              color="gradient"
              variant="flat"
              className="w-full py-3 rounded-md text-white bg-blue-600 font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out"
              isDisabled={loading}
            >
              {loading ? loadingMessage : "Upload & Process"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
