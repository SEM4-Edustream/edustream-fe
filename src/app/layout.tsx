import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProgressProvider from "@/components/providers/ProgressProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ViewTransitions } from 'next-view-transitions';

// Optimize Google Fonts: Subsets vietnamese to prevent missing accents (FOUT)
const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "EduStream - Platform Study Online",
  description: "E-Learning Platform System",
  icons: {
    icon: '/images/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="vi" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased text-slate-700 bg-slate-50`}>
          <AuthProvider>
            <ProgressProvider>
              {children}
              <ScrollToTop />
              <Toaster richColors position="top-right" closeButton />
            </ProgressProvider>
          </AuthProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
