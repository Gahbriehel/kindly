"use client";

import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type JSX,
  useState,
} from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { ClipLoader } from "react-spinners";
import Link, { type LinkProps } from "next/link";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";

type Type = "button" | "submit" | "reset" | "link";
type Color =
  | "primary"
  | "secondary"
  | "white"
  | "outline"
  | "danger"
  | "main"
  | "gradient"
  | "transparent"
  | "sky";
type BaseButtonTypeProps = HTMLMotionProps<"button">;
type BaseLinkTypeProps = LinkProps;

type BaseButtonProps = {
  icon?: ReactNode;
  type?: Type;
  text?: string;
  loading?: boolean;
  hideText?: boolean;
  color?: Color;
  className?: string;
  badgeNumber?: number;
  position?: "icon-first" | "icon-last";
  children?: ReactNode;
} & (BaseButtonTypeProps | BaseLinkTypeProps);

interface DeleteButtonProps {
  text?: string;
  title?: string;
  color?: Color;
  loading?: boolean;
  type?: Exclude<Type, "link">;
  onClick?: () => void;
}

const motionProps = {
  initial: {
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
  whileHover: { scale: 1.01, boxShadow: "0 12px 18px -3px rgb(0 0 0 / 0.1)" },
  whileTap: { scale: 0.99, boxShadow: "0 8px 12px -2px rgb(0 0 0 / 0.1)" },
};

export const BaseButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BaseButtonProps
>(function BaseButton(
  {
    icon,
    type,
    text,
    className,
    loading,
    badgeNumber,
    color = "primary",
    position = "icon-first",
    hideText = false,
    children,
    ...props
  },
  ref,
) {
  const content = children || text;

  const classNames = clsx(
    "relative flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-semibold xs:text-base sm:h-12 sm:px-6 sm:py-3 disabled:cursor-not-allowed [&>span]:hover:opacity-100 transition-all",
    {
      "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:dark:bg-slate-800 disabled:dark:border-slate-800 disabled:dark:text-slate-500":
        color === "outline",
      "border-theme-primary bg-theme-primary text-white hover:bg-theme-primary-hover disabled:bg-gray-400 disabled:border-gray-400 disabled:dark:bg-slate-800 disabled:dark:border-slate-800 disabled:dark:text-slate-500":
        color === "primary" || color === "main",
      "border-red-600 bg-red-500 text-white hover:bg-red-600 dark:border-red-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:bg-gray-400 disabled:border-gray-400 disabled:dark:bg-slate-800 disabled:dark:border-slate-800 disabled:dark:text-slate-500":
        color === "danger",
      "border-[#3D3530] bg-[#3D3530] text-white hover:bg-[#2A2320] dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:dark:bg-slate-800 disabled:dark:border-slate-800 disabled:dark:text-slate-500":
        color === "secondary",
      "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 dark:border-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:dark:bg-slate-800 disabled:dark:border-slate-800 disabled:dark:text-slate-500":
        color === "sky",
      "border-theme-primary bg-white text-theme-primary hover:bg-gray-50 dark:border-theme-primary dark:bg-slate-800 dark:text-theme-primary dark:hover:bg-slate-700 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-50 disabled:dark:text-slate-500 disabled:dark:border-slate-800 disabled:dark:bg-slate-900":
        color === "white",
      "border-transparent bg-gradient-to-r from-theme-primary to-theme-primary-hover hover:from-theme-primary-hover hover:to-theme-primary shadow-theme-primary/30 hover:shadow-theme-primary/50 dark:shadow-theme-primary/20 disabled:from-gray-400 disabled:to-gray-500 disabled:border-gray-400 disabled:dark:from-slate-800 disabled:dark:to-slate-900":
        color === "gradient",
      "bg-transparent text-theme-primary hover:bg-theme-primary/10 border border-theme-primary hover:border-theme-primary/50 dark:text-theme-primary dark:hover:bg-theme-primary/20 dark:border-theme-primary dark:hover:border-theme-primary/70 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-50 disabled:dark:text-slate-500 disabled:dark:border-slate-800":
        color === "transparent",
    },
    { "flex-row-reverse": position === "icon-last" },
    className,
  );

  if (type === "link" || (props as BaseLinkTypeProps).href) {
    return (
      <Link
        {...(props as BaseLinkTypeProps)}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        className={classNames}
      >
        {!hideText && content}
        {icon}
        {hideText && (
          <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300">
            {text}
          </span>
        )}
      </Link>
    );
  }

  return (
    <motion.button
      {...(!(props as BaseButtonTypeProps).disabled && motionProps)}
      {...(props as BaseButtonTypeProps)}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      type={type}
      className={classNames}
    >
      {!loading && (
        <>
          {!hideText && content}
          {badgeNumber && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-xs text-white">
              {badgeNumber}
            </span>
          )}
          {icon}
        </>
      )}
      {loading && (
        <ClipLoader
          size={12}
          color={
            ["white", "outline", "transparent"].includes(color)
              ? "rgb(var(--color-theme-primary))"
              : "#ffffff"
          }
        />
      )}
      {hideText && (
        <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300">
          {text}
        </span>
      )}
    </motion.button>
  );
});

BaseButton.displayName = "BaseButton";

export function DeleteButton({
  loading,
  onClick,
  title,
  text = "Delete",
  color = "danger",
  type = "button",
}: DeleteButtonProps): JSX.Element {
  const [display, setDisplay] = useState(false);
  return (
    <>
      <BaseButton
        type={type}
        color={color}
        text={text}
        onClick={() => {
          setDisplay(true);
        }}
        loading={loading}
      />
      <ConfirmActionModal
        actionName={text}
        title={title}
        fn={onClick ?? (() => {})}
        loading={loading}
        close={() => {
          setDisplay(false);
        }}
        display={display}
      />
    </>
  );
}
