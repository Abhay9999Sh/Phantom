import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskStitch AI",
  description: "AI-powered task automation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text-main min-h-screen`}>
        <header className="bg-content py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-semibold">TaskStitch AI</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
