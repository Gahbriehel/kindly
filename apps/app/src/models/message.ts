import type { IBaseResponse, IPagination } from "./base";

export type MessageStatus =
  | "OPENED"
  | "CONFIRMED"
  | "CANCELLED" // WhatsApp
  | "QUEUED"
  | "SENT"
  | "FAILED"; // Email

export interface IMessageLog {
  id: string;
  channel?: "WHATSAPP" | "EMAIL";
  status: MessageStatus;
  body: string;
  recipientName: string;
  /** Null for email. */
  recipientPhone?: string | null;
  recipientEmail?: string | null;
  subject?: string | null;
  sentAt?: string | null;
  failedAt?: string | null;
  /** Only on the WhatsApp initiate response. */
  whatsappUrl?: string;
  clientId: string;
  templateId?: string | null;
  eventId?: string | null;
  invoiceId?: string | null;
  createdAt: string;
  updatedAt?: string;
  requestedBy?: { id: string; firstName: string; lastName: string } | null;
}

export interface IWhatsappMessagePayload {
  clientId: string;
  /** Plain text, 1-4000 characters. */
  body: string;
  templateId?: string;
  /** Not combinable with `invoiceId`. */
  eventId?: string;
  invoiceId?: string;
}

export interface ISendEmailMessagePayload {
  clientId: string;
  /** 1-200 chars. Newlines are stripped server-side. */
  subject: string;
  /** HTML from the rich text editor, 1-20000 chars. Sanitized server-side. */
  body: string;
  templateId?: string;
  /** Not combinable with `invoiceId`. */
  eventId?: string;
  invoiceId?: string;
}

export interface IMessageLogResponse extends IBaseResponse {
  data: IMessageLog;
}

export interface IMessagesResponse extends IBaseResponse {
  data: IMessageLog[];
  pagination: IPagination;
}

export interface IMessagesQueryParams {
  clientId?: string;
  eventId?: string;
  invoiceId?: string;
  status?: MessageStatus;
  page?: number;
  limit?: number;
}

export const WHATSAPP_BODY_LIMIT = 4000;
export const EMAIL_SUBJECT_LIMIT = 200;
