"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { scroller } from "react-scroll";
import { HiOutlineMail } from "react-icons/hi";
import { FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";

type FooterLink = {
  name: string;
  href?: string;
  type: "scroll" | "route" | "text";
};

const exploreLinks: FooterLink[] = [
  { name: "How it works", href: "how-it-works", type: "scroll" },
  { name: "Features", href: "features", type: "scroll" },
  { name: "Who it's for", href: "target-audience", type: "scroll" },
  { name: "Pricing", href: "pricing", type: "scroll" },
];

const productLinks: FooterLink[] = [
  { name: "Calendar", type: "text" },
  { name: "Clients & groups", type: "text" },
  { name: "Templates", type: "text" },
  { name: "Staff access", type: "text" },
];

const companyLinks: FooterLink[] = [
  { name: "Meet the team", href: "team", type: "scroll" },
  {
    name: "Contact",
    href: process.env.NEXT_PUBLIC_CONTACT_URL || "",
    type: "route",
  },
];

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

const socialLinks = [
  {
    icon: FaLinkedinIn,
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    label: "LinkedIn",
  },
  {
    icon: FaXTwitter,
    href: process.env.NEXT_PUBLIC_X_URL || "",
    label: "X",
  },
  {
    icon: FaYoutube,
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    label: "YouTube",
  },
  {
    icon: HiOutlineMail,
    href: contactEmail ? `mailto:${contactEmail}` : "",
    label: "Email",
  },
];

function FooterColumn({
  title,
  links,
  onScrollLink,
}: {
  title: string;
  links: FooterLink[];
  onScrollLink: (section: string) => void;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold tracking-[1.5px] text-white/40 uppercase mb-4">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.name}>
            {link.type === "scroll" ? (
              <button
                onClick={() => onScrollLink(link.href!)}
                className="cursor-pointer text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ) : link.type === "route" ? (
              <Link
                href={link.href!}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <span className="text-sm text-white/60">{link.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");

  const handleScrollNav = (section: string): void => {
    scroller.scrollTo(section, {
      duration: 500,
      smooth: true,
      offset: -80,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#12131C] dark:bg-gray-950 text-white/60 px-8 md:px-20 transition-colors duration-300">
      <div className="w-full mx-auto pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Image
              src="/images/kindly-logo-dark.png"
              alt="Kindly"
              width={160}
              height={40}
              className="h-9 w-auto object-contain mb-5"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              Client management for people whose work depends on being
              remembered.
            </p>

            <form onSubmit={handleSubmit} className="max-w-sm">
              <label
                htmlFor="footer-email"
                className="block text-xs font-medium text-white/70 mb-2"
              >
                Email address
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5">
                  <HiOutlineMail className="w-4 h-4 text-white/40 shrink-0" />
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Join
                </button>
              </div>
              <p className="text-xs text-white/30 mt-2.5">
                One short email a month on keeping clients close.
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn
              title="Explore"
              links={exploreLinks}
              onScrollLink={handleScrollNav}
            />
            <FooterColumn
              title="Product"
              links={productLinks}
              onScrollLink={handleScrollNav}
            />
            <FooterColumn
              title="Company"
              links={companyLinks}
              onScrollLink={handleScrollNav}
            />
          </div>
        </div>

        {/* Background "Kindly" watermark */}
        <div
          aria-hidden="true"
          className="relative h-[110px] sm:h-[150px] md:h-[190px] mt-6 select-none pointer-events-none overflow-hidden"
        >
          <span
            className="absolute left-0 -bottom-1 sm:-bottom-8 md:-bottom-2 whitespace-nowrap font-jakarta font-extrabold text-white/[0.04] text-[110px] sm:text-[150px] md:text-[190px] lg:text-[220px] leading-none tracking-[-6px] lg:tracking-[-10px]"
            style={{
              fontFamily:
                "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
            }}
          >
            Kindly
          </span>
        </div>

        {/* Social icons */}
        <div className="flex justify-end gap-3 pb-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/10 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Kindly. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <button
              onClick={handleBackToTop}
              className="cursor-pointer hover:text-white transition-colors"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
