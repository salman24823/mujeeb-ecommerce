import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import SessionWrapper from "@/app/components/SessionWrapper/SessionWrapper";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata = {
  title: "COM UK",
  description: "COM UK - Your one-stop shop for all your needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="cryptomus" content="b7ff567d" />
      </head>
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <ToastContainer position="top-center" autoClose={5000} />
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
