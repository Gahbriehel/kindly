"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

interface Props {
  className?: string;
  svgClassName?: string;
  size?: "small" | "medium" | "large" | "full";
}

export function Logo({ className, size = "medium" }: Props) {
  const sizes = {
    small: "h-6 w-auto",
    medium: "h-10 w-auto",
    large: "h-16 w-auto",
    full: "w-full h-auto",
  };

  return (
    <Link href="/" className={clsx("flex items-center", className)}>
      <Image
        src="/images/logoK.png"
        alt="Kindly Logo"
        width={200}
        height={50}
        className={clsx(sizes[size], "object-contain dark:invert")}
      />
    </Link>
  );
}
