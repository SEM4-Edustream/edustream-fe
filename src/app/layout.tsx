import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Optimize Google Fonts: Subsets vietnamese to prevent missing accents (FOUT)
const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "EduStream - Platform Study Online",
  description: "E-Learning Platform System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-slate-700 bg-slate-50`}>
        <AuthProvider>
          <Navbar />

        <div className="flex flex-col min-h-screen pt-20">
          {children}
        </div>
        <Footer />
        <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
