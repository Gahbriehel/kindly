import { useState } from "react";

export function useCopyToClipboard(callback = () => {}): {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
} {
  const [isCopied, setIsCopied] = useState(false);

  function fallbackCopyToClipboard(text = ""): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
      callback();
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error) {
      console.error({ message: `Failed to copy text: ${String(error)}` });
    } finally {
      document.body.removeChild(textArea);
    }
  }

  async function copyToClipboard(text = ""): Promise<void> {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        callback();
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      } catch (error) {
        console.error({ message: `Failed to copy text: ${String(error)}` });
      }
    } else {
      fallbackCopyToClipboard(text);
    }
  }

  return { isCopied, copyToClipboard };
}
