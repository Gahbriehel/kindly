import type { Metadata } from "next";
import "@/src/styles/globals.css"; // or marketing-specific css

export const metadata: Metadata = {
  // title: "Never Forget Their Anniversary – Wedding Planner Tool",
  title: "kindly",
  description: "Warm WhatsApp reminders for busy Nigerian planners",
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
        {/* Simple marketing nav, footer, etc. */}
        <header>{/* hero-style nav */}</header>
        <main>{children}</main>
        <footer>{/* trust signals, etc. */}</footer>
      </body>
    </html>
  );
}
