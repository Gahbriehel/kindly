"use client";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#2D2622] dark:bg-gray-950 text-white/60 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-serif font-bold text-white dark:text-gray-100">
          Kindly
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} Kindly. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a
            href="#"
            className="hover:text-white dark:hover:text-gray-100 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-white dark:hover:text-gray-100 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-white dark:hover:text-gray-100 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
