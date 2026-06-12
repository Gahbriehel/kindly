import "@/src/styles/globals.css";
import Footer from "@/src/components/UI/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/auth-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative">
        <div className="w-full max-w-lg z-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
