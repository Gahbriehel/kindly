import {
  Fragment,
  type JSX,
  type ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Combobox, Transition } from "@headlessui/react";
import {
  FiCheck,
  FiChevronDown,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi";
import { type FieldError } from "react-hook-form";
import { ClipLoader } from "react-spinners";

import { cn } from "@/src/lib/utils";
import { useDebounce } from "@/src/hooks/useDebounce";
import { type IQueryParams } from "@/src/models/base";

import { ErrorMessage } from "./ErrorMessage";
import { SelectPagination } from "./SelectPagination";

export interface ISelect {
  value: {
    _id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  label: string;
}

export const emptySelect = (): ISelect => ({
  value: { _id: "" },
  label: "",
});

interface Props {
  value: ISelect;
  label?: string;
  placeholder?: string;
  options?: ISelect[];
  validationError?: FieldError | string;
  loading?: boolean;
  fetchError?: boolean;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onBlur?: () => void;
  onChange: (value: ISelect) => void;
  itemRight?: (option: ISelect) => ReactNode;
  closeIconFn?: () => void;
  addNewOption?: () => void;
  queryHook?: (params: IQueryParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  dataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformData?: (item: any) => ISelect;
  defaultLimit?: number;
  optionsClassName?: string;
  className?: string;
}
export const Select = forwardRef<HTMLInputElement, Props>(function Select(
  {
    value,
    label,
    options = [],
    validationError,
    placeholder,
    loading,
    required,
    disabled = false,
    icon,
    dataKey = "paginatedData",
    defaultLimit = 20,
    closeIconFn,
    onChange,
    onBlur,
    itemRight,
    addNewOption,
    queryHook,
    transformData,
    optionsClassName,
    className,
  }: Props,
  ref,
): JSX.Element {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: defaultLimit,
    name: "",
  });

  const queryResult = queryHook ? queryHook(queryParams) : null;

  useEffect(() => {
    if (queryHook) {
      setQueryParams((prev) => ({
        ...prev,
        name: debouncedQuery,
        page: 1,
      }));
    }
  }, [debouncedQuery, queryHook]);

  const transformedOptions = useMemo(() => {
    if (!queryHook || !queryResult?.data) return [];

    const dataArray =
      dataKey.split(".").reduce((obj, key) => obj?.[key], queryResult.data) ||
      [];

    if (!Array.isArray(dataArray)) return [];

    return dataArray.map((item) => {
      if (transformData) {
        return transformData(item);
      }
      return {
        value: { _id: item._id || item.id },
        label: item.name || item.label || item.title || "",
      };
    });
  }, [queryHook, queryResult?.data, dataKey, transformData]);

  const availableOptions = queryHook ? transformedOptions : options;
  const filteredOptions = useMemo(() => {
    if (queryHook) {
      return availableOptions;
    }

    return query === ""
      ? availableOptions
      : availableOptions.filter((option) => {
          return option.label?.toLowerCase().includes(query?.toLowerCase());
        });
  }, [queryHook, availableOptions, query]);

  const isLoading = queryHook ? queryResult?.isLoading : loading;

  const handleChange = (selectedValue: ISelect | null): void => {
    if (disabled || !selectedValue) return;
    if (
      addNewOption &&
      selectedValue?.value?._id === "" &&
      selectedValue?.label === ""
    ) {
      addNewOption();
      return;
    }
    onChange(selectedValue);
  };

  return (
    <fieldset className={cn("relative space-y-2", className)}>
      <Combobox value={value} onChange={handleChange} disabled={disabled}>
        {label && (
          <Combobox.Label className="block text-sm font-semibold text-gray-600 dark:text-slate-300">
            {label} {required && <span className="text-red-600">*</span>}
          </Combobox.Label>
        )}
        <div className="relative flex items-center gap-2">
          <Combobox.Button className="w-full">
            <Combobox.Input
              ref={ref}
              disabled={disabled}
              className={cn(
                "h-10 w-full rounded-xl border bg-gray-100 px-4 py-2 text-sm font-medium capitalize text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                disabled &&
                  "pointer-events-none cursor-not-allowed bg-gray-50 opacity-60 dark:bg-slate-900",
              )}
              onChange={(event) => {
                if (disabled) return;
                setQuery(event.target.value);
              }}
              displayValue={(value: ISelect) => value?.label ?? ""}
              placeholder={placeholder ?? "Start typing to search..."}
              onBlur={onBlur}
            />

            {/* Icons only show when NOT disabled */}
            {!disabled &&
              ((!isLoading && !closeIconFn) ||
                (closeIconFn && !value?.value?._id)) && (
                <FiChevronDown
                  className={cn(
                    "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400",
                    {
                      "right-4": !icon,
                      "right-12": icon,
                    },
                  )}
                  aria-hidden="true"
                />
              )}

            {!disabled && !isLoading && closeIconFn && value?.value?._id && (
              <FiXCircle
                onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                  e.preventDefault();
                  closeIconFn();
                }}
                className={cn(
                  "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400",
                  {
                    "right-4": !icon,
                    "right-12": icon,
                  },
                )}
                aria-hidden="true"
              />
            )}
            {isLoading && (
              <div
                className={cn(
                  "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400",
                  {
                    "right-4": !icon,
                    "right-8": icon,
                  },
                )}
              >
                <ClipLoader size={12} />
              </div>
            )}
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setQuery("");
            }}
          >
            <Combobox.Options
              className={cn(
                "absolute top-8 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:shadow-slate-900/50 dark:ring-slate-700 sm:text-sm",
                optionsClassName,
              )}
            >
              {queryHook && queryResult?.data && (
                <SelectPagination
                  currentPage={queryParams.page ?? 1}
                  totalCount={queryResult.data.totalCount ?? 0}
                  limit={queryParams.limit ?? defaultLimit}
                  onPageChange={(page: number) => {
                    setQueryParams((prev) => ({
                      ...prev,
                      page,
                    }));
                  }}
                />
              )}
              {addNewOption && (
                <Combobox.Option
                  value={emptySelect()}
                  className="flex cursor-pointer items-center gap-2 px-10 py-2 text-sky-900 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-slate-700"
                >
                  <>
                    <span className="font-medium">Add new</span>
                    <FiPlusCircle className="h-4 w-4 shrink-0" />
                  </>
                </Combobox.Option>
              )}
              {!isLoading && filteredOptions?.length === 0 && query !== "" && (
                <div className="relative cursor-default select-none px-10 py-2 text-gray-700 dark:text-slate-400">
                  Nothing found.
                </div>
              )}
              {!isLoading &&
                (options?.length || availableOptions?.length) === 0 && (
                  <div className="relative cursor-default select-none px-10 py-2 text-gray-700 dark:text-slate-400">
                    No options.
                  </div>
                )}
              {isLoading && (
                <div className="relative cursor-default select-none px-10 py-2 text-gray-700 dark:text-slate-400">
                  Loading...
                </div>
              )}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `group relative flex items-center py-2 pl-10 pr-4 ${
                        active
                          ? "bg-sky-500 text-white dark:bg-sky-600"
                          : "text-gray-900 dark:text-slate-200"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn("block truncate capitalize", {
                            "font-medium": selected,
                            "font-normal": !selected,
                          })}
                        >
                          {option.label}
                        </span>
                        {(selected ||
                          value?.value?._id === option.value._id) && (
                          <FiCheck
                            className={cn(
                              "absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2",
                              {
                                "text-sky-500": !active,
                                "text-white": active,
                              },
                            )}
                            aria-hidden="true"
                          />
                        )}
                        <div className="ml-auto opacity-0 group-hover:opacity-100">
                          {itemRight?.(option)}
                        </div>
                      </>
                    )}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Transition>
          {icon}
        </div>
      </Combobox>
      {validationError && (
        <ErrorMessage
          message={
            typeof validationError === "string"
              ? (validationError ?? "")
              : (validationError.message ?? "")
          }
        />
      )}
    </fieldset>
  );
});
