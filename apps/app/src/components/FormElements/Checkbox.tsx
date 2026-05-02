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
        "h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}
