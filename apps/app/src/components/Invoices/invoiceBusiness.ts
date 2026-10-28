import dayjs from "dayjs";
import type { ICompanyData } from "@/src/models/auth";
import type { IInvoice, IInvoiceSettingsPayload } from "@/src/models/invoice";

/** Business details printed on an invoice. */
export interface InvoiceBusiness {
  businessName: string;
  logoUrl: string | null;
  billingAddress: string | null;
  country: string | null;
  phoneNumber: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
}

/** Live details, for drafts: invoice settings first, then the company profile. */
export function getCurrentBusiness(
  settings: IInvoiceSettingsPayload | null | undefined,
  company: ICompanyData | null | undefined,
): InvoiceBusiness {
  return {
    businessName: company?.businessName || "Your business",
    logoUrl: settings?.logoUrl || company?.logoUrl || null,
    billingAddress: settings?.billingAddress || company?.billingAddress || null,
    country: company?.country || null,
    phoneNumber: company?.phoneNumber || null,
    registrationNumber:
      settings?.registrationNumber || company?.registrationNumber || null,
    taxId: settings?.taxId || company?.taxId || null,
    bankAccountName:
      settings?.bankAccountName || company?.bankAccountName || null,
    bankAccountNumber:
      settings?.bankAccountNumber || company?.bankAccountNumber || null,
    bankName: settings?.bankName || company?.bankName || null,
  };
}

/** What the client actually received: the snapshot taken when it was first sent. */
export function getSnapshotBusiness(
  invoice: IInvoice,
  company: ICompanyData | null | undefined,
): InvoiceBusiness {
  return {
    businessName:
      invoice.businessNameSnapshot || company?.businessName || "Your business",
    logoUrl: invoice.logoUrlSnapshot ?? null,
    billingAddress: invoice.billingAddressSnapshot ?? null,
    country: invoice.businessCountrySnapshot ?? null,
    phoneNumber: company?.phoneNumber || null,
    registrationNumber: invoice.registrationNumberSnapshot ?? null,
    taxId: invoice.taxIdSnapshot ?? null,
    bankAccountName: invoice.bankAccountNameSnapshot ?? null,
    bankAccountNumber: invoice.bankAccountNumberSnapshot ?? null,
    bankName: invoice.bankNameSnapshot ?? null,
  };
}

const BUSINESS_FIELD_LABELS: [keyof InvoiceBusiness, string][] = [
  ["logoUrl", "logo"],
  ["billingAddress", "billing address"],
  ["registrationNumber", "registration number"],
  ["taxId", "tax ID"],
  ["bankName", "bank name"],
  ["bankAccountName", "account name"],
  ["bankAccountNumber", "account number"],
];

const listJoin = (parts: string[]): string =>
  parts.length <= 1
    ? parts.join("")
    : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

interface SendCheck {
  business: InvoiceBusiness;
  clientName?: string | null;
  clientEmail?: string | null;
  hasEvent: boolean;
  /** `YYYY-MM-DD` */
  dueDate?: string | null;
  /** Where the user fixes invoice fields: the create steps or the edit flow. */
  fixInvoiceHint: { event: string; dueDate: string };
}

/** Everything the backend requires before a draft can be sent, as readable reasons. */
export function getSendBlockers({
  business,
  clientName,
  clientEmail,
  hasEvent,
  dueDate,
  fixInvoiceHint,
}: SendCheck): string[] {
  const blockers: string[] = [];
  const missing = BUSINESS_FIELD_LABELS.filter(([key]) => !business[key]).map(
    ([, label]) => label,
  );
  if (missing.length)
    blockers.push(`Add your ${listJoin(missing)} in Profile → Business.`);
  if (!clientEmail?.trim())
    blockers.push(
      `Add an email address to ${clientName || "the client"}'s profile.`,
    );
  if (!hasEvent) blockers.push(fixInvoiceHint.event);
  if (!dueDate || dueDate <= dayjs().format("YYYY-MM-DD"))
    blockers.push(fixInvoiceHint.dueDate);
  return blockers;
}
