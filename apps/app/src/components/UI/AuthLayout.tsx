"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BaseButton } from "./Buttons";
import { type ReactNode, type JSX } from "react";
import { RiArrowLeftLine } from "react-icons/ri";

interface Props {
  title?: string;
  subtext: string;
  children: ReactNode;
  footer?: ReactNode;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  handleSubmit: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onSubmit: (data: any) => void | Promise<void>;
  backButton?: boolean;
  loading: boolean;
}

export function AuthLayout({
  title,
  children,
  handleSubmit,
  onSubmit,
  subtext,
  loading,
  footer,
  backButton,
}: Props): JSX.Element {
  const router = useRouter();

  return (
    <div className="relative">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        onSubmit={handleSubmit(onSubmit)}
        className="relative overflow-hidden rounded-[2.5rem] border-0 bg-white dark:bg-slate-900 shadow-2xl dark:shadow-slate-950/50 ring-1 ring-gray-100 dark:ring-slate-800 w-full max-w-[600px] mx-auto p-8 sm:p-12 transition-colors duration-200"
      >
        <div className="relative">
          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-serif font-extrabold tracking-tight text-[#3D3530] dark:text-slate-100">
              {title ?? "Welcome back"}
            </h1>
            <p className="text-base font-medium text-gray-500 dark:text-slate-400">
              {subtext}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">{children}</div>

        <div className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {backButton && (
              <BaseButton
                icon={<RiArrowLeftLine className="h-4 w-4" />}
                position="icon-first"
                text="Back"
                type="button"
                className="flex-1 !h-14 font-bold rounded-2xl"
                color="outline"
                onClick={() => {
                  router.back();
                }}
              />
            )}
            <BaseButton
              text={loading ? "Processing..." : "Continue"}
              type="submit"
              className="flex-1 !h-14 font-bold rounded-2xl shadow-lg shadow-theme-primary/20"
              color="primary"
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </motion.form>

      {footer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          {footer}
        </motion.div>
      )}
    </div>
  );
}
