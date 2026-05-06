import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProgressProvider from "@/components/providers/ProgressProvider";
import { ViewTransitions } from 'next-view-transitions';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased text-slate-700 bg-slate-50`}>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <ProgressProvider>
                {children}
                <Toaster richColors position="top-right" closeButton />
              </ProgressProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
