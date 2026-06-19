import type { JSX, ChangeEvent } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: Props): JSX.Element {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 text-gray-400 dark:text-slate-500">
        <IoSearchOutline size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 pl-12 pr-12 text-sm text-gray-700 dark:text-slate-200 shadow-sm transition-all outline-none focus:border-gray-300 dark:focus:border-slate-500 focus:ring-2 focus:ring-gray-100 dark:focus:ring-slate-700/50 placeholder:text-gray-300 dark:placeholder:text-slate-600"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="cursor-pointer absolute right-4 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        >
          <IoClose size={20} />
        </button>
      )}
    </div>
  );
}
