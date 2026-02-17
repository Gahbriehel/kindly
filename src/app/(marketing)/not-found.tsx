"use client";

import { TbError404 } from "react-icons/tb";
import Link from "next/link";

import type { JSX } from "react";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <TbError404 className="h-40 w-40" />
      <h3 className="">
        Page not found. Click{" "}
        <Link href="/" className="text-sky-600">
          here
        </Link>{" "}
        to go back
      </h3>
      <p className="text-blue-500">If you think this is an error, please contact support.</p>
    </div>
  );
}
