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
          <div className="flex justify-center m-2">
            <div className="flex-col p-8 mt-16 rounded-lg bg-purple-100 w-fit">
              <div className="flex justify-center">
                <form className="w-fit" action="/" method="GET">
                  <button type="submit" className="p-8 pt-4 rounded-lg text-white bg-purple-800 hover:bg-purple-700 active:bg-purple-600 cursor-pointer">
                    <span className="text-4xl"><b>Equipment Registry</b></span>
                  </button>
                </form>
              </div>
              <div className="mt-10">
                {children}
              </div>
            </div>
          </div>
          <div className="mt-64 flex justify-center w-full">
            <a className="w-fit bg-slate-300 text-slate-500 p-2 rounded-md" href="https://www.flaticon.com/free-icons/fencing" title="fencing icons">Fencing icons created by Freepik - Flaticon</a>
          </div>
        </body>
    </html>
  );
}
