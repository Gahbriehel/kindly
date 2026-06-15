import { clsx } from "clsx";
import {
  forwardRef,
  type ReactNode,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ErrorMessage } from "./ErrorMessage";

interface Props extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  label?: string;
  countryCode?: string;
  error?: string;
  password?: boolean;
  required?: boolean;
  icon?: ReactNode;
  hidePassword?: () => void;
  showPassword?: () => void;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    id,
    label,
    error,
    password,
    required,
    showPassword,
    hidePassword,
    countryCode,
    icon,
    className,
    ...props
  },
  ref,
) {
  return (
    <fieldset className="relative space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
        >
          {label}&nbsp; {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative flex">
        {countryCode && (
          <div className="h-10 rounded-l-xl border border-gray-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
              {countryCode}
            </span>
          </div>
        )}
        <input
          {...props}
          ref={ref}
          id={id}
          value={props.value ?? ""}
          className={clsx(
            "h-10 w-full rounded-r-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400",
            "focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20",
            "dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500",
            "dark:focus:border-theme-primary dark:focus:bg-slate-900 dark:focus:ring-theme-primary/20",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-slate-800/40 dark:disabled:text-slate-600",
            className,
            error &&
              "border-red-500 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500/50 focus:ring-red-500/20 dark:focus:ring-red-500/20",
            {
              "rounded-l-xl": !countryCode,
            },
          )}
        />
        {password &&
          (props.type === "password" ? (
            <FiEye
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={showPassword}
            />
          ) : (
            <FiEyeOff
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={hidePassword}
            />
          ))}
        {icon}
      </div>
      {error && <ErrorMessage message={error} />}
    </fieldset>
  );
});
