import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={plusJakartaSans.className}>
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
