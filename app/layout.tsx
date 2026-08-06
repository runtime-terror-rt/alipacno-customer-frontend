import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-international-phone/style.css";
import "./globals.css";
import Header from "../components/Header";
import StartOrderClient from "../components/StartOrderClient";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alipacno",
  description: "Alipacno - Your Premium Food Choice",
  icons: {
    icon: "/logo.png",
  },
};

import { ReduxProvider } from "../redux/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
