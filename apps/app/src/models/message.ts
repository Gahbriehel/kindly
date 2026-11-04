import type { IBaseResponse, IPagination } from "./base";

export type MessageStatus = "OPENED" | "CONFIRMED" | "CANCELLED";

export interface IMessageLog {
  id: string;
  channel?: string;
  status: MessageStatus;
  body: string;
  recipientName: string;
  recipientPhone: string;
  whatsappUrl: string;
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
