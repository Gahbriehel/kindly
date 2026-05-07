"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsMoonStars, BsSun } from "react-icons/bs";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const navRef = useRef<HTMLElement>(null);

  // Handle click outside to close mobile nav
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="fixed top-4 w-full z-50 px-4 md:px-8 flex justify-center pointer-events-none transition-all duration-300">
      <nav
        ref={navRef}
        className="pointer-events-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-gray-200 shadow-lg p-4 md:px-10 border border-gray-200/50 dark:border-gray-800/50 w-[calc(100%-2rem)] md:w-3/4 lg:w-1/2 flex rounded-full"
      >
        <div className="w-full flex justify-between items-center">
          <Link href="#" className="flex items-center gap-1">
            <Image src="/images/logoK.png" alt="Logo" width={80} height={80} />
          </Link>
          {/* Mobile Actions: Theme Switcher & Hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="text-2xl cursor-pointer hover:text-kblue-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <BsMoonStars /> : <BsSun />}
            </button>
            <button
              className="text-3xl focus:outline-none relative w-8 h-8 flex flex-col justify-center items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div
                className="w-6 h-[2px] bg-current mb-1.5 rounded-full"
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 8 : 0,
                }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              <motion.div
                className="w-6 h-[2px] bg-current mb-1.5 rounded-full"
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              <motion.div
                className="w-6 h-[2px] bg-current rounded-full"
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -8 : 0,
                }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </button>
          </div>

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
            {/* <li>
              <BaseButton
                color="secondary"
                text="Start free"
                onClick={() => handleScrollNav("pricing")}
                className="px-5 py-2 text-sm rounded-full sm:h-10 sm:px-5 sm:py-2"
              />
            </li>*/}
          </ul>

          {isOpen && (
            <motion.ul
              className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-xl flex flex-col items-center py-10 md:hidden backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50"
              initial={{ opacity: 0, y: "-50%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
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
              {/*  <li className="py-4">
                <BaseButton
                  type="button"
                  icon={<BiChevronRight />}
                  color="secondary"
                  text="Start free"
                  onClick={() => {
                    handleScrollNav("pricing");
                    setIsOpen(false);
                  }}
                />
              </li> */}
            </motion.ul>
          )}
          {/* Desktop Theme Switcher */}
          <div
            className="hidden md:block cursor-pointer text-2xl ml-4 hover:text-kblue-light transition-colors"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <span role="button" aria-label="Switch to dark mode">
                <BsMoonStars />
              </span>
            ) : (
              <span role="button" aria-label="Switch to light mode">
                <BsSun />
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
