import { type JSX } from "react";
import { clsx } from "clsx";

interface Props {
  id: string;
  checked: boolean;
  className?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  id,
  checked,
  onChange,
  className = "",
  disabled = false,
}: Props): JSX.Element {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        "h-4 w-4 rounded border-gray-300 text-theme-primary bg-white focus:ring-theme-primary focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-offset-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}
