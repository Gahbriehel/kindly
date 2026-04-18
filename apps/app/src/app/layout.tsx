import "@/src/styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./utils/ProvidersWrapper";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Kindly App",
  description: "Internal management for Kindly",
  icons: {
    icon: "/images/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextTopLoader height={4} showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
