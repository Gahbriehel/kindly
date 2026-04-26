"use client";

import { useRouter } from "next/navigation";
import { useEffect, type JSX } from "react";

export default function Home(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return <></>;
}
