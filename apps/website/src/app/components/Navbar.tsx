"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { BiChevronRight } from "react-icons/bi";
import { BaseButton } from "./ui/button";

const navLinks = [
  { name: "About us", link: "about", type: "scroll" },
  { name: "How it works", link: "how-it-works", type: "scroll" },
  { name: "Features", link: "features", type: "scroll" },
  { name: "Who it's for", link: "target-audience", type: "scroll" },
  { name: "Team", link: "team", type: "scroll" },
  { name: "Pricing", link: "pricing", type: "scroll" },
];

const navLinkClass =
  "font-inter text-[14px] leading-[20px] tracking-[0px] font-medium text-[#374151] hover:text-[#2F3E9E] dark:text-gray-300 dark:hover:text-white transition-colors";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const navRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleScrollNav = (section: string): void => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        scroller.scrollTo(section, {
          duration: 500,
          smooth: true,
          offset: -80,
        });
      }, 400);
    } else {
      scroller.scrollTo(section, {
        duration: 500,
        smooth: true,
        offset: -80,
      });
    }
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-900">
      <nav
        ref={navRef}
        className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/kindly-logo-light.png"
            alt="Kindly"
            width={200}
            height={50}
            priority
            className="h-9 w-auto object-contain dark:hidden"
          />
          <Image
            src="/images/kindly-logo-dark.png"
            alt="Kindly"
            width={200}
            height={50}
            priority
            className="h-9 w-auto object-contain hidden dark:block"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ name, link }) => (
            <li key={link}>
              <button
                onClick={() => handleScrollNav(link)}
                className={`cursor-pointer ${navLinkClass}`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <Link href="/login" className={navLinkClass}>
            Sign in
          </Link>
          <BaseButton
            type="link"
            href="/register"
            icon={<BiChevronRight />}
            color="secondary"
            text="Get started"
            className="!h-12 !w-[140px] !gap-1.5 !rounded-xl !border-[#2B43AE] !bg-[#2B43AE] !py-[9px] !px-5 !text-sm hover:!bg-[#23368D]"
          />
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-400 hover:text-[#2F3E9E] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <BsMoonStars /> : <BsSun />}
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-400 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <BsMoonStars /> : <BsSun />}
          </button>
          <button
            className="relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              className="w-6 h-[2px] bg-gray-900 dark:bg-gray-100 mb-1.5 rounded-full"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-6 h-[2px] bg-gray-900 dark:bg-gray-100 mb-1.5 rounded-full"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-6 h-[2px] bg-gray-900 dark:bg-gray-100 rounded-full"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>

        {isOpen && (
          <motion.ul
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 flex flex-col items-center py-8 lg:hidden border-b border-gray-100 dark:border-gray-900"
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {navLinks.map(({ name, link }) => (
              <li key={link} className="py-3">
                <button
                  onClick={() => handleScrollNav(link)}
                  className="cursor-pointer text-base font-medium text-gray-800 dark:text-gray-200"
                >
                  {name}
                </button>
              </li>
            ))}
            <li className="pt-4 flex flex-col items-center gap-4 w-full px-8">
              <Link
                href="/login"
                className="text-base font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <BaseButton
                type="link"
                href="/register"
                icon={<BiChevronRight />}
                color="secondary"
                text="Get started"
                className="w-full !gap-1.5 !rounded-xl !border-[#2B43AE] !bg-[#2B43AE] !py-[9px] hover:!bg-[#23368D]"
              />
            </li>
          </motion.ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
