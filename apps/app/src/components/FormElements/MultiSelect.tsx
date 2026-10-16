import { Fragment, type JSX, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { type FieldError } from "react-hook-form";
import { ClipLoader } from "react-spinners";

import { cn } from "@/src/lib/utils";
import { useDebounce } from "@/src/hooks/useDebounce";
import { type IQueryParams } from "@/src/models/base";

import { ErrorMessage } from "./ErrorMessage";
import { SelectPagination } from "./SelectPagination";
import type { ISelect } from "./Select";

interface Props {
  value: ISelect[];
  onChange: (value: ISelect[]) => void;
  label?: string;
  placeholder?: string;
  options?: ISelect[];
  validationError?: FieldError | string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  /** Server-driven options. Must be a stable reference (e.g. module-level). */
  queryHook?: (params: IQueryParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  /** Path to the options array in the query result. */
  dataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformData?: (item: any) => ISelect;
  defaultLimit?: number;
  className?: string;
}

const sameOption = (a: ISelect, b: ISelect): boolean =>
  a.value._id === b.value._id;

/**
 * Searchable multi-select. Selected items show as removable chips and stay
 * selected when a search narrows the option list.
 */
export function MultiSelect({
  value,
  onChange,
  label,
  placeholder,
  options = [],
  validationError,
  loading,
  required,
  disabled = false,
  onBlur,
  queryHook,
  dataKey = "data",
  transformData,
  defaultLimit = 20,
  className,
}: Props): JSX.Element {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const queryParams: IQueryParams = {
    page,
    limit: defaultLimit,
    name: debouncedQuery,
  };

  const queryResult = queryHook ? queryHook(queryParams) : null;

  const remoteList: unknown = queryResult?.data
    ? dataKey.split(".").reduce((obj, key) => obj?.[key], queryResult.data)
    : undefined;
  const remoteOptions: ISelect[] = Array.isArray(remoteList)
    ? remoteList.map(
        (item): ISelect =>
          transformData
            ? transformData(item)
            : {
                value: { _id: item._id || item.id },
                label: item.name || item.label || item.title || "",
              },
      )
    : [];

  const availableOptions = queryHook ? remoteOptions : options;
  const filteredOptions =
    queryHook || query === ""
      ? availableOptions
      : availableOptions.filter((o) =>
          o.label?.toLowerCase().includes(query.toLowerCase()),
        );

  const isLoading = queryHook ? queryResult?.isLoading : loading;

  const remove = (option: ISelect) =>
    onChange(value.filter((v) => !sameOption(v, option)));

  return (
    <fieldset className={cn("relative space-y-2", className)}>
      <Combobox
        multiple
        by={sameOption}
        value={value}
        disabled={disabled}
        onChange={(next: ISelect[]) => {
          onChange(next);
          setQuery("");
          if (inputRef.current) inputRef.current.value = "";
        }}
      >
        {label && (
          <Combobox.Label className="block text-sm font-semibold text-gray-600 dark:text-slate-300">
            {label} {required && <span className="text-red-600">*</span>}
          </Combobox.Label>
        )}
        <div className="relative">
          <Combobox.Button as="div" className="w-full">
            <div
              className={cn(
                "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-10 transition-all",
                "focus-within:border-theme-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-theme-primary/20",
                "dark:border-slate-700 dark:bg-slate-800/80",
                disabled && "pointer-events-none opacity-60",
                validationError && "border-red-500 dark:border-red-500/50",
              )}
            >
              {value.map((option) => (
                <span
                  key={option.value._id}
                  className="inline-flex max-w-full items-center gap-1 rounded-full bg-theme-primary/10 py-0.5 pl-2.5 pr-1 text-xs font-semibold text-theme-primary"
                >
                  <span className="truncate">{option.label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${option.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(option);
                    }}
                    className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-theme-primary/20"
                  >
                    <FiX className="size-3" />
                  </button>
                </span>
              ))}
              <Combobox.Input
                ref={inputRef}
                disabled={disabled}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                displayValue={() => ""}
                onBlur={onBlur}
                placeholder={
                  value.length
                    ? ""
                    : (placeholder ?? "Start typing to search...")
                }
                className="min-w-24 flex-1 bg-transparent py-0.5 text-sm font-medium text-gray-700 outline-none placeholder-gray-400 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
            <span className="pointer-events-none absolute right-4 top-5 -translate-y-1/2 text-gray-400">
              {isLoading ? (
                <ClipLoader size={12} />
              ) : (
                <FiChevronDown className="size-5" aria-hidden="true" />
              )}
            </span>
          </Combobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700 sm:text-sm">
              {queryHook && queryResult?.data && (
                <SelectPagination
                  currentPage={page}
                  totalCount={
                    queryResult.data.pagination?.total ??
                    queryResult.data.totalCount ??
                    0
                  }
                  limit={queryParams.limit ?? defaultLimit}
                  onPageChange={setPage}
                />
              )}
              {isLoading ? (
                <div className="cursor-default select-none px-10 py-2 text-gray-700 dark:text-slate-400">
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="cursor-default select-none px-10 py-2 text-gray-700 dark:text-slate-400">
                  {query !== "" ? "Nothing found." : "No options."}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value._id}
                    value={option}
                    className={({ active }) =>
                      cn(
                        "relative flex cursor-pointer items-center py-2 pl-10 pr-4",
                        active
                          ? "bg-sky-500 text-white dark:bg-sky-600"
                          : "text-gray-900 dark:text-slate-200",
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn(
                            "block truncate",
                            selected ? "font-medium" : "font-normal",
                          )}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <FiCheck
                            className={cn(
                              "absolute left-4 top-1/2 size-3 -translate-y-1/2",
                              active ? "text-white" : "text-sky-500",
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {validationError && (
        <ErrorMessage
          message={
            typeof validationError === "string"
              ? validationError
              : (validationError.message ?? "")
          }
        />
      )}
    </fieldset>
  );
}
