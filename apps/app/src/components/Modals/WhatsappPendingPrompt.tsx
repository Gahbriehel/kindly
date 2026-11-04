"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { WhatsappConfirmBody } from "@/src/components/Modals/WhatsappConfirmBody";
import {
  useCancelMessage,
  useConfirmMessage,
} from "@/src/hooks/useWhatsappMessageMutations";
import { customToast } from "@/src/helpers/customToast";
import {
  clearWhatsappPending,
  isModalConfirming,
  readWhatsappPending,
  type WhatsappPending,
} from "@/src/helpers/whatsappPending";

/**
 * Asks "Did you send it?" when the user comes back to the app (or reloads)
 * after opening WhatsApp without answering. Mounted once in the app layout.
 */
export function WhatsappPendingPrompt(): JSX.Element | null {
  const [pending, setPending] = useState<WhatsappPending | null>(null);
  const [answering, setAnswering] = useState<"yes" | "no" | null>(null);
  const confirm = useConfirmMessage();
  const cancel = useCancelMessage();

  const check = useCallback(() => {
    // The send modal asks the question itself while it is open.
    if (isModalConfirming()) return;
    setPending((current) => current ?? readWhatsappPending());
  }, []);

  useEffect(() => {
    const initial = setTimeout(check, 0);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(initial);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check]);

  if (!pending) return null;

  const answer = async (choice: "yes" | "no") => {
    setAnswering(choice);
    try {
      if (choice === "yes") {
        await confirm.mutateAsync(pending.id);
        customToast.success("Logged");
      } else {
        await cancel.mutateAsync(pending.id);
      }
      clearWhatsappPending();
      setPending(null);
    } catch {
      // The interceptor toasts the error; keep the question open to retry.
    } finally {
      setAnswering(null);
    }
  };

  return (
    <CenterModal
      display
      close={() => setPending(null)}
      maxWidth="max-w-sm"
      className="p-0"
      ariaLabel="Confirm WhatsApp message"
    >
      <WhatsappConfirmBody
        clientName={pending.clientName}
        loading={answering}
        onYes={() => answer("yes")}
        onNo={() => answer("no")}
      />
    </CenterModal>
  );
}
