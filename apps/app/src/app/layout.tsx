import "@/src/styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./utils/ProvidersWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Kindly App",
  description: "Internal management for Kindly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
