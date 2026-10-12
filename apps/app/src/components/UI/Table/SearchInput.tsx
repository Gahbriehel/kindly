import type { JSX, ChangeEvent } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
}: Props): JSX.Element {
  return (
    <div className={`relative flex items-center w-full ${className ?? ""}`}>
      <div className="absolute left-4 text-gray-400 dark:text-slate-500 pointer-events-none">
        <IoSearchOutline size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-10 text-sm text-gray-800 dark:text-slate-200 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="cursor-pointer absolute right-3.5 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1"
          title="Clear search"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
}
