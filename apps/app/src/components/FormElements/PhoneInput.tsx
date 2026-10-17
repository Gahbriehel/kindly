import {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  type ComponentProps,
  type ChangeEvent,
} from "react";
import { clsx } from "clsx";
import { FiChevronDown } from "react-icons/fi";
import { Input } from "./Input";
import { useCountriesQuery } from "@/src/hooks/useLocationQuery";
import { FALLBACK_COUNTRIES } from "@/src/models/locations";

const DEFAULT_DIAL_CODE = "234";

interface DialOption {
  code: string;
  label: string;
}

const digitsOnly = (v: string) => v.replace(/\D/g, "");

/** Splits an international number ("+2348012345678") into code + national part. */
function splitPhone(
  value: string,
  codes: string[],
): { code: string; national: string } {
  const trimmed = value.trim();
  if (!trimmed.startsWith("+")) {
    return { code: DEFAULT_DIAL_CODE, national: digitsOnly(trimmed) };
  }
  const digits = digitsOnly(trimmed);
  // Longest matching code wins so "+1242…" is not read as "+1".
  const code = [...codes]
    .sort((a, b) => b.length - a.length)
    .find((c) => digits.startsWith(c));
  return code
    ? { code, national: digits.slice(code.length) }
    : { code: DEFAULT_DIAL_CODE, national: digits };
}

type InputProps = ComponentProps<typeof Input>;

interface Props extends Omit<
  InputProps,
  "value" | "onChange" | "type" | "countryCode"
> {
  /** International format (+<code><number>) or "" */
  value?: string;
  onChange: (value: string) => void;
}

/**
 * Country-code select + national number. The value it reads and emits is the
 * international format the backend expects, e.g. "+2348012345678".
 */
export const PhoneInput = forwardRef<HTMLInputElement, Props>(
  function PhoneInput(
    { value = "", onChange, id, className, error, label, required, ...props },
    ref,
  ) {
    const { data } = useCountriesQuery();

    const options = useMemo<DialOption[]>(() => {
      const list = data?.data?.countries?.length
        ? data.data.countries
        : FALLBACK_COUNTRIES;
      const seen = new Set<string>();
      const result: DialOption[] = [];
      for (const c of list) {
        const code = digitsOnly(c.phoneCode ?? "");
        if (!code || seen.has(code)) continue;
        seen.add(code);
        result.push({ code, label: `${c.name} (+${code})` });
      }
      return result;
    }, [data]);

    const codes = useMemo(() => options.map((o) => o.code), [options]);

    const { code: parsedCode, national } = splitPhone(value ?? "", codes);
    const hasPlus = (value ?? "").trim().startsWith("+");

    const [selectedCode, setSelectedCode] = useState<string>(() =>
      hasPlus ? parsedCode : DEFAULT_DIAL_CODE,
    );

    useEffect(() => {
      if (hasPlus) {
        setSelectedCode(parsedCode);
      }
    }, [hasPlus, parsedCode]);

    const activeCode = hasPlus ? parsedCode : selectedCode;

    const emit = (nextCode: string, nextNational: string) => {
      const n = digitsOnly(nextNational).replace(/^0+/, "");
      onChange(n ? `+${nextCode}${n}` : "");
    };

    const handleCodeChange = (nextCode: string) => {
      setSelectedCode(nextCode);
      emit(nextCode, national);
    };

    const handleNationalChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw.trim().startsWith("+")) {
        const parsed = splitPhone(raw, codes);
        setSelectedCode(parsed.code);
        emit(parsed.code, parsed.national);
        return;
      }
      emit(activeCode, raw);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
          >
            {label}&nbsp; {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="flex">
          <div className="relative h-10 w-[5.5rem] shrink-0">
            <span
              aria-hidden
              className="flex h-full items-center justify-between gap-1 rounded-l-xl border border-r-0 border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              +{activeCode}
              <FiChevronDown className="size-3.5 text-gray-400" />
            </span>
            <select
              aria-label="Country code"
              value={activeCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            >
              {/* Keeps a code we cannot resolve selectable instead of silently swapping it */}
              {!options.some((o) => o.code === activeCode) && (
                <option value={activeCode}>+{activeCode}</option>
              )}
              {options.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <Input
              {...props}
              ref={ref}
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              error={error}
              value={national}
              onChange={handleNationalChange}
              className={clsx("rounded-l-none!", className)}
            />
          </div>
        </div>
      </div>
    );
  },
);
