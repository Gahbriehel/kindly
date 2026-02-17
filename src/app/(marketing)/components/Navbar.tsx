"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsMoon, BsSun } from "react-icons/bs";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const pathname = usePathname();
  const router = useRouter();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    if (initialTheme !== theme) {
      setTimeout(() => setTheme(initialTheme), 0);
    }
  }, []);

  // Apply theme to <html> and save to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // 🧠 Scroll helper — ensures scroll works even after navigation
  const handleScrollNav = (section: string): void => {
    if (pathname !== "/") {
      router.push("/"); // Go to homepage first
      // Wait a tick for React to render home sections
      setTimeout(() => {
        scroller.scrollTo(section, {
          duration: 500,
          smooth: true,
          offset: -50,
        });
      }, 400);
    } else {
      scroller.scrollTo(section, {
        duration: 500,
        smooth: true,
        offset: -50,
      });
    }
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  const navLinks = [
    { name: "How it works", link: "how-it-works", type: "scroll" },
    { name: "Features", link: "features", type: "scroll" },
    { name: "Pricing", link: "pricing", type: "scroll" },
  ];

  return (
    <nav className="sticky top-0 bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-md z-50 p-4 md:px-10 border-b border-gray-200/50 dark:border-gray-800/50 w-full md:w-3/4 lg:w-1/2 flex m-auto rounded-full my-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/images/logoK.png" alt="Logo" width={80} height={80} />
        </Link>
        {/* Hamburger */}
        <button
          className="md:hidden text-3xl focus:outline-none ml-4 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            className="w-5 h-0.5 bg-current mb-1 rounded-full"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0,
            }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          <motion.div
            className="w-5 h-0.5 bg-current mb-1 rounded-full"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          <motion.div
            className="w-5 h-0.5 bg-current rounded-full"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0,
            }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ name, link, type }) => (
            <li key={link} className="relative group">
              {type === "router" ? (
                <Link
                  href={link}
                  className="hover:text-kblue-light dark:hover:text-kblue-light text-base relative transition-colors"
                >
                  <span>{name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      pathname === link
                        ? "w-full bg-blue-100"
                        : "w-0 group-hover:wl"
                    }`}
                  ></span>
                </Link>
              ) : (
                <button
                  onClick={() => handleScrollNav(link)}
                  className="cursor-pointer hover:text-kblue-light dark:hover:text-kblue-light text-base relative transition-colors"
                >
                  <span>{name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </button>
              )}
            </li>
          ))}
          {/* CTA in Nav */}
          <li>
            <button
              onClick={() => handleScrollNav("pricing")}
              className="bg-[#3D3530] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black cursor-pointer transition-colors"
            >
              Start free
            </button>
          </li>
        </ul>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.ul
            className="absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-md flex flex-col items-center py-20 md:hidden backdrop-blur-md rounded-b-2xl"
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Mobile Theme Switcher */}
            <li className="py-4 mb-4">
              <button
                onClick={toggleTheme}
                className="cursor-pointer text-lg font-light tracking-wider relative transition-colors"
              >
                {theme === "light" ? (
                  <>
                    <span className="flex gap-2 items-center">
                      <BsMoon className="text-xl" /> Dark Mode
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex gap-2 items-center">
                      <BsSun className="text-xl" /> Light Mode
                    </span>
                  </>
                )}
              </button>
            </li>
            {navLinks.map(({ name, link, type }) => (
              <li key={link} className="py-4 gap-3 relative group">
                {type === "router" ? (
                  <Link
                    href={link}
                    className="text-lg font-light tracking-wider relative transition-colors dark:text-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {name}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleScrollNav(link)}
                    className="cursor-pointer text-lg font-light tracking-wider relative transition-colors dark:text-gray-300"
                  >
                    {name}
                  </button>
                )}
              </li>
            ))}
            <li className="py-4 mt-4">
              <button
                onClick={() => {
                  handleScrollNav("pricing");
                  setIsOpen(false);
                }}
                className="bg-[#3D3530] text-white px-8 py-3 rounded-full text-xl font-medium hover:bg-black transition-colors"
              >
                Start free
              </button>
            </li>
          </motion.ul>
        )}

        {/* Desktop Theme Switcher */}
        <div
          className="hidden md:block cursor-pointer text-base ml-4"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <span role="img" aria-label="Switch to dark mode">
              <BsMoon />
            </span>
          ) : (
            <span role="img" aria-label="Switch to light mode">
              ☀️
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
