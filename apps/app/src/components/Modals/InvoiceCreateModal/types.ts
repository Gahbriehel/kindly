import type { ISelect } from "@/src/components/FormElements/Select";
import type { IInvoicePayload } from "@/src/models/invoice";

export interface InvoiceClient {
  id: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface InvoiceEvent {
  id: string;
  title: string;
  date: string;
  category?: { id: string; name: string } | null;
}

export interface InvoiceItemValues {
  item: string;
  quantity: string;
  priceEach: string;
}

/** Numeric inputs are kept as strings so they can be cleared while typing. */
export interface InvoiceFormValues {
  client: InvoiceClient | null;
  description: string;
  event: InvoiceEvent | null;
  items: InvoiceItemValues[];
  currency: ISelect;
  discountPercent: string;
  taxPercent: string;
  dueDate: string;
  note: string;
}

export const emptyItem = (item = ""): InvoiceItemValues => ({
  item,
  quantity: "1",
  priceEach: item ? "0" : "",
});

export const toNumber = (value: string): number => Number(value) || 0;

export function toInvoicePayload(values: InvoiceFormValues): IInvoicePayload {
  return {
    clientId: values.client?.id ?? "",
    ...(values.event && { eventId: values.event.id }),
    currency: values.currency.value._id,
    description: values.description.trim(),
    ...(values.note.trim() && { note: values.note.trim() }),
    dueDate: values.dueDate,
    discountPercent: toNumber(values.discountPercent),
    taxPercent: toNumber(values.taxPercent),
    items: values.items.map((item) => ({
      item: item.item.trim(),
      quantity: toNumber(item.quantity),
      priceEach: toNumber(item.priceEach),
    })),
  };
}
