import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/src/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "kindly",
  description: "Warm reminders for busy creators",
  icons: {
    icon: "/images/logo-icon.png",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`marketing-theme scroll-smooth ${inter.variable} ${jakarta.variable}`}
    >
      <body className="antialiased bg-cream-50 text-gray-900">
        <header></header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
