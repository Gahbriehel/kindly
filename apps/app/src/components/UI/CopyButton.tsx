import type { JSX } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useCopyToClipboard } from "@/src/hooks/useCopyToClipboard";
import { customToast } from "@/src/helpers/customToast";

export function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}): JSX.Element {
  const { isCopied, copyToClipboard } = useCopyToClipboard(() =>
    customToast.success(`${label} copied`),
  );
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={() => {
        void copyToClipboard(text);
      }}
      className="shrink-0 cursor-pointer rounded p-0.5 text-gray-400 opacity-0 transition hover:text-theme-primary focus-visible:opacity-100 group-hover:opacity-100 dark:text-slate-500"
    >
      {isCopied ? (
        <FiCheck className="size-3.5 text-green-600" />
      ) : (
        <FiCopy className="size-3.5" />
      )}
    </button>
  );
}
