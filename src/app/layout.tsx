import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyRent",
  description: "An Equipment Rental Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F4F3]">
        <main className="flex-1">{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              style: { background: "#15803d", color: "#ffffff" },
              iconTheme: { primary: "#ffffff", secondary: "#15803d" },
            },
            error: {
              style: { background: "#b91c1c", color: "#ffffff" },
              iconTheme: { primary: "#ffffff", secondary: "#b91c1c" },
            },
          }}
        />
      </body>
    </html>
  );
}
