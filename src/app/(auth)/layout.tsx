import Image from "next/image";
import Link from "next/link";
import { BsChatHeart, BsCalendarHeart, BsHeart } from "react-icons/bs";
import "@/src/styles/globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
          {/* Left Pane - Marketing / Branding */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#FFF9F5] dark:bg-gray-800 p-12 px-16 relative overflow-hidden">
            {/* Logo */}
            <div className="z-10">
              <Link href="/">
                <Image
                  src="/images/logoK.png"
                  alt="Kindly Logo"
                  width={100}
                  height={100}
                  className="cursor-pointer dark:invert"
                />
              </Link>
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col gap-6 max-w-[500px] mt-12">
              <h1 className="text-5xl leading-tight font-serif text-[#3D3530] dark:text-gray-100">
                Relationships deserve to be remembered.
              </h1>
              <p className="text-[#5A534D] dark:text-gray-300 text-lg">
                Kindly helps you remember the moments that matter to your
                clients.
              </p>

              <div className="relative w-full h-64 mt-6 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/auth-image.jpg"
                  alt="Conversations Mug"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Features Footer */}
            <div className="z-10 flex gap-8 mt-12 text-sm text-[#5A534D] dark:text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#FF9B7A] shadow-sm">
                  <BsChatHeart size={20} />
                </div>
                <span className="max-w-[80px] leading-tight">
                  Thoughtful messages
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#FF9B7A] shadow-sm">
                  <BsCalendarHeart size={20} />
                </div>
                <span className="max-w-[80px] leading-tight">
                  Smart reminders
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#FF9B7A] shadow-sm">
                  <BsHeart size={20} />
                </div>
                <span className="max-w-[80px] leading-tight">
                  Build connections
                </span>
              </div>
            </div>
          </div>

          {/* Right Pane - Form Area */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
            {/* Mobile Logo */}
            <div className="absolute top-8 left-8 lg:hidden">
              <Link href="/">
                <Image
                  src="/images/logoK.png"
                  alt="Kindly Logo"
                  width={80}
                  height={80}
                  className="cursor-pointer dark:invert"
                />
              </Link>
            </div>

            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
