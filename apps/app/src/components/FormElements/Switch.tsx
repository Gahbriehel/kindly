import { Switch } from "@headlessui/react";
import { clsx } from "clsx";
import { ErrorMessage } from "./ErrorMessage";
import { type JSX } from "react";
import type { Noop, FieldError } from "react-hook-form";

interface Props {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: Noop;
  error: FieldError | undefined;
  required?: boolean;
  className?: string;
}

export function SwitchWrapper({
  label,
  value,
  error,
  onChange,
  onBlur,
  required,
  className = "",
}: Props): JSX.Element {
  return (
    <fieldset className={clsx("relative space-y-2", className)}>
      <label className="block text-sm font-semibold text-gray-600">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <Switch
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(
          "relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full border border-gray-400 transition",
          { "bg-theme-primary": value, "bg-gray-200": !value },
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            { "translate-x-6": value, "translate-x-1": !value },
          )}
        />
      </Switch>
      {error && <ErrorMessage message={error.message ?? ""} />}
    </fieldset>
  );
}
