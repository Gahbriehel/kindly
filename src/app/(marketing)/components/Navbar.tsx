"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { BsMoon } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { FaCode, FaGitAlt, FaLaptopCode } from "react-icons/fa6";
import Image from "next/image";

const Navbar = () => {
    const fonts = ["font-serif", "font-signika", "font-sans"];
    const [currentFont, setCurrentFont] = useState(fonts[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    const location = useLocation();
    const navigate = useNavigate();

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

    // Change font quickly
    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            setCurrentFont(randomFont);
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    // 🧠 Scroll helper — ensures scroll works even after navigation
    const handleScrollNav = (section: string): void => {
        if (location.pathname !== "/") {
            navigate("/"); // Go to homepage first
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

    return (
        <nav className="sticky top-0 bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-md z-50 p-4 md:px-10 border-b border-gray-200/50 dark:border-gray-800/50 w-1/2 flex m-auto rounded-full mt-8">
            <div className="container mx-auto flex justify-between items-center">
                <RouterLink to="/" className="flex items-center gap-1">
                    <Image src="/images/logoK.png" alt="Logo" width={80} height={80} />
                </RouterLink>
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
                <ul className="hidden md:flex gap-8">
                    {[
                        {
                            name: (
                                <>
                                    <span className="flex items-center">
                                        <FaLaptopCode className="inline mr-1 text-lg" /> Resume
                                    </span>
                                </>
                            ),
                            link: "/resume",
                            type: "router",
                        },
                        {
                            name: (
                                <>
                                    <span className="flex items-center">
                                        <FaGitAlt className="inline mr-1 text-lg" /> Projects
                                    </span>
                                </>
                            ),
                            link: "projects",
                            type: "scroll",
                        },
                        {
                            name: (
                                <>
                                    <span className="flex items-center">
                                        <FaCode className="inline mr-1 text-lg" /> Toolkit
                                    </span>
                                </>
                            ),
                            link: "toolkit",
                            type: "scroll",
                        },
                        {
                            name: (
                                <>
                                    <span className="flex items-center">
                                        <MdOutlineMail className="inline mr-1 text-lg" />
                                        Contact
                                    </span>
                                </>
                            ),
                            link: "contact",
                            type: "scroll",
                        },
                    ].map(({ name, link, type }) => (
                        <li key={link} className="relative group">
                            {type === "router" ? (
                                <RouterLink
                                    to={link}
                                    className="hover:text-kblue-light dark:hover:text-kblue-light text-base relative transition-colors"
                                >
                                    <span>{name}</span>
                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ease-in-out ${location.pathname === link
                                                ? "w-full bg-blue-100"
                                                : "w-0 group-hover:wl"
                                            }`}
                                    ></span>
                                </RouterLink>
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
                </ul>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.ul
                        className="absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-md flex flex-col items-center py-20 md:hidden backdrop-blur-md"
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
                                    <>☀️ Light Mode</>
                                )}
                            </button>
                        </li>
                        {[
                            {
                                name: (
                                    <>
                                        <span className="flex items-center">
                                            <FaLaptopCode className="inline mr-1 text-lg" /> Resume
                                        </span>
                                    </>
                                ),
                                link: "/resume",
                                type: "router",
                            },
                            {
                                name: (
                                    <>
                                        <span className="flex items-center">
                                            <FaGitAlt className="inline mr-1 text-lg" /> Projects
                                        </span>
                                    </>
                                ),
                                link: "projects",
                                type: "scroll",
                            },
                            {
                                name: (
                                    <>
                                        <span className="flex items-center">
                                            <FaCode className="inline mr-1 text-lg" /> Toolkit
                                        </span>
                                    </>
                                ),
                                link: "toolkit",
                                type: "scroll",
                            },
                            {
                                name: (
                                    <>
                                        <span className="flex items-center">
                                            <MdOutlineMail className="inline mr-1 text-lg" />
                                            Contact
                                        </span>
                                    </>
                                ),
                                link: "contact",
                                type: "scroll",
                            },
                        ].map(({ name, link, type }) => (
                            <li key={link} className="py-4 gap-3 relative group">
                                {type === "router" ? (
                                    <RouterLink
                                        to={link}
                                        className="text-2xl font-light tracking-wider relative transition-colors dark:text-gray-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-in-out group-hover:w-full"></span>
                                    </RouterLink>
                                ) : (
                                    <button
                                        onClick={() => handleScrollNav(link)}
                                        className="cursor-pointer text-2xl font-light tracking-wider relative transition-colors dark:text-gray-300"
                                    >
                                        {name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-in-out group-hover:w-full"></span>
                                    </button>
                                )}
                            </li>
                        ))}
                    </motion.ul>
                )}

                {/* Desktop Theme Switcher */}
                <div
                    className="hidden md:block cursor-pointer text-2xl"
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
