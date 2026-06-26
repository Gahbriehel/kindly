import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 md:py-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 w-full transition-colors duration-300 z-10">
      <div>
        <Image
          src="/images/kindly-logo-light.png"
          alt="Kindly Logo"
          width={120}
          height={35}
          className="cursor-pointer h-auto dark:hidden"
        />
        <Image
          src="/images/kindly-logo-dark.png"
          alt="Kindly Logo"
          width={120}
          height={35}
          className="cursor-pointer h-auto hidden dark:block"
        />
      </div>
      <div className="flex items-center gap-6 text-sm text-[#5A534D] dark:text-slate-400 font-medium">
        <Link
          href="#"
          className="hover:underline hover:text-[#2C42BA] transition-colors"
        >
          About
        </Link>
        <Link
          href="#"
          className="hover:underline hover:text-[#2C42BA] transition-colors"
        >
          Help
        </Link>
        <Link
          href="#"
          className="hover:underline hover:text-[#2C42BA] transition-colors"
        >
          Privacy
        </Link>
        <Link
          href="#"
          className="hover:underline hover:text-[#2C42BA] transition-colors"
        >
          Terms
        </Link>
      </div>
      <div className="text-sm text-[#5A534D] dark:text-slate-400 font-medium">
        © 2026 Kindly
      </div>
    </footer>
  );
}
