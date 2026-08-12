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
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'text-sm font-medium',
            style: {
              borderRadius: '12px',
              background: '#2a2a2c',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            },
            success: {
              iconTheme: {
                primary: '#f9671a',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
