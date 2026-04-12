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
          className="block text-sm font-semibold text-gray-600"
        >
          {label}&nbsp; {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative flex">
        {countryCode && (
          <div className="h-10 rounded-l-xl border bg-white px-4 py-2">
            <span className="text-sm font-medium text-gray-600">
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
            "h-10 w-full rounded-r-xl border bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 disabled:cursor-not-allowed",
            className,
            error && "border-red-500",
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
