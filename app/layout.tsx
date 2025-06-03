import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from "react";

export const metadata: Metadata = {
  title: "UniStep Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <div className="flex min-h-screen flex-col items-center">
          {children}
          <footer className="w-full py-6 flex justify-center">
            <div className="container px-4 md:px-6">
              <div className="mt-6 flex justify-center items-center border-t pt-6 text-center text-sm text-gray-600">
                &copy; {new Date().getFullYear()} UniStep. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
