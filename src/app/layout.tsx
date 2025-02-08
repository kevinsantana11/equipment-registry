import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equipment Registry",
  description: "Virtual lost and found",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex justify-center">
            <div className="p-8 mt-16 rounded-lg bg-purple-50">
              <form action="/" method="GET">
                <button type="submit" className="p-8 pt-4 rounded-lg text-white bg-purple-800 hover:bg-purple-700 active:bg-purple-600 cursor-pointer">
                  <span className="text-4xl"><b>Equipment Registry</b></span>
                </button>
              </form>
              <div className="mt-10">
                {children}
              </div>
            </div>
          </div>
        </body>
    </html>
  );
}
