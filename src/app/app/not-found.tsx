"use client";

import Link from "next/link";
import { TbError404Off } from "react-icons/tb";
import type { JSX } from "react";

export default function AppNotFound(): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <TbError404Off className="h-40 w-40" />
      <h3 className="">
        Page not found. Click{" "}
        <Link href="/app" className="text-sky-600">
          here
        </Link>{" "}
        to go back
      </h3>
      <p className="text-blue-500">
        If you think this is an error, please contact support.
      </p>
    </div>
  );
}
