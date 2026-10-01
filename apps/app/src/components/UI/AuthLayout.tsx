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
  headerContent?: ReactNode;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  handleSubmit?: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onSubmit?: (data: any) => void | Promise<void>;
  onFormSubmit?: (e: React.FormEvent) => void;
  backButton?: boolean;
  backHref?: string;
  onBack?: () => void;
  loading: boolean;
  submitButtonText?: string;
  submitButtonIcon?: ReactNode;
  showSubmitButton?: boolean;
}

export function AuthLayout({
  title,
  children,
  handleSubmit,
  onSubmit,
  onFormSubmit,
  subtext,
  loading,
  footer,
  headerContent,
  backButton,
  backHref = "/",
  onBack,
  submitButtonText,
  submitButtonIcon,
  showSubmitButton = true,
}: Props): JSX.Element {
  const router = useRouter();

  const getSubmitText = () => {
    if (submitButtonText) return submitButtonText;
    if (title === "Welcome back") return "Sign in";
    if (title === "Create account" || title === "Create your account")
      return "Create Account";
    if (title === "Reset password") return "Reset Password";
    return "Continue";
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(backHref);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (onFormSubmit) {
      onFormSubmit(e);
    } else if (handleSubmit && onSubmit) {
      handleSubmit(onSubmit)(e);
    }
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto py-6 sm:py-8">
      {/* Mobile Back Button - positioned cleanly above header to avoid blocking form fields */}
      {backButton && (
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors z-20 group border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            <RiArrowLeftLine className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-white" />
          </button>
        </div>
      )}

      {/* Title & Subtext Centered Outside the Card */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          {title ?? "Welcome back"}
        </h1>
        <p className="text-base font-medium text-slate-200">{subtext}</p>
        {headerContent && <div className="pt-2">{headerContent}</div>}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        onSubmit={handleFormSubmit}
        className="relative overflow-visible rounded-[2rem] border-0 bg-white dark:bg-slate-900 w-full p-8 sm:p-10 transition-colors duration-200 shadow-2xl"
      >
        {/* Desktop Back Button - floating to the left of the card */}
        {backButton && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="hidden lg:flex absolute left-[-60px] top-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors z-20 group border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            <RiArrowLeftLine className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-white" />
          </button>
        )}

        <div className="space-y-5 mb-8">{children}</div>

        {showSubmitButton && (
          <div className="pt-2">
            <BaseButton
              text={loading ? "Processing..." : getSubmitText()}
              icon={!loading ? submitButtonIcon : undefined}
              type="submit"
              className="w-full !h-14 font-bold rounded-2xl text-base shadow-lg shadow-theme-primary/25"
              color="primary"
              loading={loading}
              disabled={loading}
            />
          </div>
        )}

        {footer && (
          <div className="mt-8 text-center text-sm font-medium">{footer}</div>
        )}
      </motion.form>
    </div>
  );
}
