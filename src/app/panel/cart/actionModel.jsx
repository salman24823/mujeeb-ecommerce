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

// React component
export default function ActionModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="hover:bg-indigo-600 hover:text-white hover:border-0 w-full border border-indigo-500 bg-transparent text-indigo-500 font-semibold py-3 rounded-md focus:outline-none transition-colors duration-300 ease-in-out"
        onPress={onOpen}
      >
        Complete Purchase
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
                  Purchase Completed
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
                    Your purchase was successfully completed!
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Thank you for shopping with us. We hope to see you again soon.
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
