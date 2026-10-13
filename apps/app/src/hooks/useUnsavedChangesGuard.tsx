"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { UnsavedChangesModal } from "@/src/components/Modals/UnsavedChangesModal";

interface UnsavedChangesGuard {
  /** Use for every user-initiated exit (backdrop, X, Cancel). */
  requestClose: () => void;
  /** Render once alongside the form. */
  prompt: JSX.Element;
}

/**
 * Prevents accidental data loss: while `isDirty`, exits ask for confirmation
 * and a browser tab close/refresh shows the native warning. Programmatic
 * closes (e.g. after a successful save) should call `close` directly.
 */
export function useUnsavedChangesGuard(
  isDirty: boolean,
  close: () => void,
  active = true,
): UnsavedChangesGuard {
  const [confirming, setConfirming] = useState(false);
  const guarded = isDirty && active;

  useEffect(() => {
    if (!guarded) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [guarded]);

  const requestClose = useCallback(() => {
    if (guarded) setConfirming(true);
    else close();
  }, [guarded, close]);

  const prompt = (
    <UnsavedChangesModal
      display={confirming}
      stay={() => setConfirming(false)}
      discard={() => {
        setConfirming(false);
        close();
      }}
    />
  );

  return { requestClose, prompt };
}
