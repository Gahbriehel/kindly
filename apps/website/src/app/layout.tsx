import type { Metadata } from "next";
import "@/src/styles/globals.css";

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
    <html lang="en" className="marketing-theme scroll-smooth">
      <body className="antialiased bg-cream-50 text-gray-900">
        <header></header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
