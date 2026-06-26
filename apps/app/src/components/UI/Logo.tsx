"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

interface Props {
  className?: string;
  svgClassName?: string;
  size?: "small" | "medium" | "large" | "full";
  iconOnly?: boolean;
}

export function Logo({ className, size = "medium", iconOnly = false }: Props) {
  const sizes = {
    small: "h-6 w-auto",
    medium: "h-10 w-auto",
    large: "h-16 w-auto",
    full: "w-full h-auto",
  };

  if (iconOnly) {
    return (
      <Link
        href="/"
        className={clsx("flex items-center justify-center shrink-0", className)}
      >
        <Image
          src="/images/kindly-icon.png"
          alt="Kindly Icon"
          width={32}
          height={32}
          className="h-8 w-8 object-contain shrink-0"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={clsx("flex items-center", className)}>
      {/* Light Mode Logo */}
      <Image
        src="/images/kindly-logo-light.png"
        alt="Kindly Logo"
        width={200}
        height={50}
        className={clsx(sizes[size], "object-contain dark:hidden")}
      />
      {/* Dark Mode Logo */}
      <Image
        src="/images/kindly-logo-dark.png"
        alt="Kindly Logo"
        width={200}
        height={50}
        className={clsx(sizes[size], "object-contain hidden dark:block")}
      />
    </Link>
  );
}
