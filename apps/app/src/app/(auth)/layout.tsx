import "@/src/styles/globals.css";
import Image from "next/image";
import Footer from "@/src/components/UI/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen min-h-dvh flex flex-col">
      {/* Fixed background layer with Next.js Image */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#072464]">
        <Image
          src="/images/auth-bg.png"
          alt="Auth background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative z-10">
        <div className="w-full max-w-lg">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
