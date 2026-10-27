import { IBaseResponse, IPagination } from "./base";
import { IClient } from "./client";
import { IEvent } from "./event";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "VOID"
  | "PARTIALLY_PAID"
  | "OVERDUE";

export interface IInvoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  invoiceNumber: string;
  effectiveStatus: InvoiceStatus;
  status: InvoiceStatus;
  currency: string;
  description?: string;
  note?: string;
  dueDate: string;
  issuedAt?: string | null;
  sentAt?: string | null;
  voidedAt?: string | null;
  discountPercent?: number;
  taxPercent?: number;
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  total: number;
  amountPaid?: number;
  balanceDue?: number;
  companyId: string;
  clientId: string;
  eventId?: string | null;
  createdById?: string;
  sentById?: string | null;
  voidedById?: string | null;
  businessNameSnapshot?: string | null;
  billingAddressSnapshot?: string | null;
  businessCountrySnapshot?: string | null;
  logoUrlSnapshot?: string | null;
  registrationNumberSnapshot?: string | null;
  taxIdSnapshot?: string | null;
  bankAccountNameSnapshot?: string | null;
  bankAccountNumberSnapshot?: string | null;
  bankNameSnapshot?: string | null;
  clientNameSnapshot?: string | null;
  clientEmailSnapshot?: string | null;
  clientPhoneSnapshot?: string | null;
  eventNameSnapshot?: string | null;
  eventDateSnapshot?: string | null;
  client?: IClient | null;
  event?: IEvent | null;
  items?: IItem[];
  payments?: IInvoicePayment[];
}

export interface IInvoicePayload {
  clientId: string;
  eventId?: string;
  currency: string;
  description: string;
  note?: string;
  dueDate: string;
  discountPercent: number;
  taxPercent: number;
  items: {
    item: string;
    quantity: number;
    priceEach: number;
  }[];
}

/** `eventId: null` unlinks the event from a draft. */
export type IUpdateInvoicePayload = Omit<
  Partial<IInvoicePayload>,
  "eventId"
> & {
  eventId?: string | null;
};

export interface ISaveInvoiceResponse extends IBaseResponse {
  data: { invoice: IInvoice };
}

export interface IItem {
  id: string;
  createdAt: string;
  item: string;
  quantity: number;
  priceEach: number;
  lineTotal: number;
  invoiceId: string;
}

export interface IInvoiceResponse extends IBaseResponse {
  data: IInvoice[];
  pagination: IPagination;
}

export interface IInvoicePayment {
  id?: string;
  amount: number;
  paidAt: string;
  reference?: string | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  invoiceId?: string;
}

export interface ISingleInvoiceResponse extends IBaseResponse {
  data: {
    invoice: IInvoice;
    items: IItem[];
    payments: IInvoicePayment[];
    client: IClient;
    event: IEvent | null;
  };
}

export interface IInvoicePaymentPayload {
  amount: number;
  paidAt: string;
  reference: string;
  note: string;
}

export interface IInvoiceStatusSummaryItem {
  count: number;
  total: number;
}

export interface IInvoicePartiallyPaidSummaryItem extends IInvoiceStatusSummaryItem {
  amountPaid: number;
  balanceDue: number;
}

export interface IInvoiceCurrencySummary {
  currency: string;
  totalAmountWaitingToBePaid: number;
  amountWaitingToBePaid: number;
  totalOutstanding: number;
  totalOverdueInvoices: number;
  totalOverdueAmount: number;
  totalAmountPaidSoFar: number;
  paidSoFar: number;
  totalDrafts: number;
  totalDraftAmount: number;
  totalInvoiced: number;
  totalInvoices: number;
  collectionRate?: number;
  averageInvoiceValue?: number;
  draft?: IInvoiceStatusSummaryItem;
  awaitingPayment?: IInvoiceStatusSummaryItem;
  overdue?: IInvoiceStatusSummaryItem;
  paid?: IInvoiceStatusSummaryItem;
  partiallyPaid?: IInvoicePartiallyPaidSummaryItem;
  dueSoon?: IInvoiceStatusSummaryItem;
  void?: IInvoiceStatusSummaryItem;
}

export interface IInvoiceSummaryResponse {
  message?: string;
  statusCode?: number;
  totalInvoices?: number;
  totalDrafts?: number;
  totalAwaitingPayment?: number;
  totalOverdue?: number;
  totalPaid?: number;
  totalPartiallyPaid?: number;
  totalVoid?: number;
  summary?: IInvoiceCurrencySummary | null;
  currencies?: IInvoiceCurrencySummary[];
  data?: {
    totalInvoices?: number;
    totalDrafts?: number;
    totalAwaitingPayment?: number;
    totalOverdue?: number;
    totalPaid?: number;
    totalPartiallyPaid?: number;
    totalVoid?: number;
    summary?: IInvoiceCurrencySummary | null;
    currencies?: IInvoiceCurrencySummary[];
  };
}

export interface IInvoiceSettingsResponse extends IBaseResponse {
  data: {
    settings: {
      logoUrl: string | null;
      bankAccountName: string | null;
      bankAccountNumber: string | null;
      bankName: string | null;
      billingAddress: string | null;
      registrationNumber: string | null;
      taxId: string | null;
    };
  };
}

export interface IInvoiceSettingsPayload {
  logoUrl: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  billingAddress: string | null;
  registrationNumber: string | null;
  taxId: string | null;
}
