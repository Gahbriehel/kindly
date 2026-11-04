/**
 * A WhatsApp chat the user opened but hasn't said whether they sent.
 * Kept in sessionStorage so the question survives a reload or a tab switch.
 */
const KEY = "kindly:whatsapp-pending";

export interface WhatsappPending {
  id: string;
  clientName: string;
}

/** True while SendClientMessageModal is asking the question itself. */
let modalConfirming = false;
export const setModalConfirming = (value: boolean): void => {
  modalConfirming = value;
};
export const isModalConfirming = (): boolean => modalConfirming;

export function readWhatsappPending(): WhatsappPending | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WhatsappPending>;
    return parsed.id
      ? { id: parsed.id, clientName: parsed.clientName || "the client" }
      : null;
  } catch {
    return null;
  }
}

export function writeWhatsappPending(pending: WhatsappPending): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(pending));
  } catch {
    // Storage can be blocked; the in-modal prompt still works.
  }
}

export function clearWhatsappPending(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
