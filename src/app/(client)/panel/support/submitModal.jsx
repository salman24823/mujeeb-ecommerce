import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";

// React component
export default function SubmitModel({formData}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function handleSubmitForm() {
    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful response
        toast.success("Sign up Success. Redirecting...");
        onOpen()
      } else {
        // Handle error response
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred while creating the user");
    }
  }

  return (
    <>
      <Button
        className="hover:bg-indigo-600 hover:text-white hover:border-0 w-full border border-indigo-500 bg-transparent text-indigo-500 font-semibold py-3 rounded-md focus:outline-none transition-colors duration-300 ease-in-out"
        onPress={handleSubmitForm}
      >
        Submit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-center">
                <h2 className="text-xl font-semibold text-white">
                  Form Submitted
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="py-5 flex justify-center">
                  {/* Icon */}
                  <div className="w-1/3">
                    <svg
                      viewBox="0 0 26 26"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        display: "block",
                        color: "green", // SVG path uses circle color to inherit this
                      }}
                    >
                      <g
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          className="circle"
                          d="M13 1C6.372583 1 1 6.372583 1 13s5.372583 12 12 12 12-5.372583 12-12S19.627417 1 13 1z"
                          style={{
                            strokeDasharray: 76,
                            strokeDashoffset: 76,
                            animation: "draw 1s forwards",
                          }}
                        />
                        {/* Tick path with a custom green stroke */}
                        <path
                          className="tick"
                          d="M6.5 13.5L10 17l8.808621-8.308621"
                          style={{
                            strokeDasharray: 18,
                            strokeDashoffset: 18,
                            animation: "draw 1s forwards 1s",
                            stroke: "green", // Set the tick stroke to green
                          }}
                        />
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col items-center mt-6">
                  <p className="text-lg text-gray-800 font-semibold">
                    ThankYou For your Query
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    You'll Get Reply Form Admin Soon!.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="gradient"
                  variant="flat"
                  onPress={onClose}
                  className="w-full py-3 rounded-md text-white font-semibold transition-colors duration-300 ease-in-out"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
