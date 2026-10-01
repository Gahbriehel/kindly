import "@/src/styles/globals.css";
import { Geist, Inter } from "next/font/google";
import { Providers } from "../utils/ProvidersWrapper";
import NextTopLoader from "nextjs-toploader";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Kindly App",
  description: "Internal management for Kindly",
  icons: {
    icon: "/images/kindly-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${inter.variable} font-inter antialiased`}
      >
        <NextTopLoader color="#3D3530" height={4} showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
