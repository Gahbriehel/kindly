import { Fragment, type JSX, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FiCheck, FiPlus, FiTag, FiX } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

import { cn } from "@/src/lib/utils";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useTagsQuery } from "@/src/hooks/useClientQuery";

import { SelectPagination } from "./SelectPagination";

const PAGE_LIMIT = 5;

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Reports whether the user has typed something that isn't added yet. */
  onDraftChange?: (hasDraft: boolean) => void;
  id?: string;
  label?: string;
}

interface TagOption {
  name: string;
  isNew: boolean;
}

const sameTag = (a: string, b: string): boolean =>
  a.toLowerCase() === b.toLowerCase();

export function TagInput({
  value,
  onChange,
  onDraftChange,
  id = "client-tag",
  label = "Tags (Optional)",
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);

  // The page belongs to the search it was chosen for, so a new search starts
  // back on page 1 without needing an effect.
  const [pageState, setPageState] = useState({ search: "", page: 1 });
  const page = pageState.search === debouncedQuery ? pageState.page : 1;

  const { data, isFetching } = useTagsQuery({
    search: debouncedQuery,
    page,
    limit: PAGE_LIMIT,
  });

  const draft = query.trim();
  const saved = data?.data ?? [];
  const canCreate =
    draft !== "" &&
    !value.some((t) => sameTag(t, draft)) &&
    !saved.some((t) => sameTag(t.name, draft));

  const options: TagOption[] = [
    ...saved.map((t) => ({ name: t.name, isNew: false })),
    ...(canCreate ? [{ name: draft, isNew: true }] : []),
  ];

  const updateQuery = (next: string): void => {
    setQuery(next);
    onDraftChange?.(next.trim() !== "");
  };

  const addTag = (name: string): void => {
    const tag = name.trim();
    if (tag && !value.some((t) => sameTag(t, tag))) {
      onChange([...value, tag]);
    }
    updateQuery("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
      >
        {label}
      </label>

      <Combobox<TagOption | null>
        value={null}
        onChange={(option) => option && addTag(option.name)}
      >
        <div className="relative">
          <FiTag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Combobox.Input
            id={id}
            ref={inputRef}
            autoComplete="off"
            displayValue={() => ""}
            placeholder="Search or type a new tag, e.g. VIP"
            onChange={(e) => updateQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              // With a highlighted option the combobox selects it itself.
              // Otherwise Enter adds what was typed and must not submit the
              // surrounding form.
              if (e.currentTarget.getAttribute("aria-activedescendant")) return;
              e.preventDefault();
              addTag(query);
            }}
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500"
          />
          {isFetching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <ClipLoader size={12} />
            </div>
          )}

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-1 w-full overflow-hidden rounded-md bg-white py-1 text-sm ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700">
              {data && (
                <SelectPagination
                  currentPage={page}
                  totalCount={data.pagination.total}
                  limit={PAGE_LIMIT}
                  onPageChange={(next) =>
                    setPageState({ search: debouncedQuery, page: next })
                  }
                />
              )}
              {options.length === 0 && !isFetching && (
                <div className="cursor-default select-none px-4 py-2 text-gray-500 dark:text-slate-400">
                  {draft
                    ? "No matching tags."
                    : "No saved tags yet. Type to create one."}
                </div>
              )}
              {options.map((option) => {
                const selected =
                  !option.isNew && value.some((t) => sameTag(t, option.name));
                return (
                  <Combobox.Option
                    key={option.isNew ? `new:${option.name}` : option.name}
                    value={option}
                    disabled={selected}
                    className={({ active }) =>
                      cn(
                        "relative flex cursor-pointer items-center gap-2 py-2 pl-10 pr-4",
                        active
                          ? "bg-sky-500 text-white dark:bg-sky-600"
                          : "text-gray-900 dark:text-slate-200",
                        selected && "cursor-default opacity-50",
                      )
                    }
                  >
                    {option.isNew ? (
                      <>
                        <FiPlus
                          className="absolute left-4 top-1/2 size-3 -translate-y-1/2"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          Create &ldquo;{option.name}&rdquo;
                        </span>
                      </>
                    ) : (
                      <>
                        {selected && (
                          <FiCheck
                            className="absolute left-4 top-1/2 size-3 -translate-y-1/2"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate">{option.name}</span>
                      </>
                    )}
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <FiX className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
