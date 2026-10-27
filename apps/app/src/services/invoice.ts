import axios from "axios";
import type { IBaseResponse, IQueryParams } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type {
  IInvoiceResponse,
  ISingleInvoiceResponse,
  IInvoiceSummaryResponse,
  IInvoiceSettingsResponse,
  IInvoiceSettingsPayload,
  IInvoicePayload,
  IUpdateInvoicePayload,
  ISaveInvoiceResponse,
} from "../models/invoice";

export async function getInvoices(
  params: IQueryParams = {},
): Promise<IInvoiceResponse> {
  const response = await axios.get<IInvoiceResponse>("/invoices", {
    params: cleanObject(params),
  });
  return response.data;
}

export async function getInvoice(id: string): Promise<ISingleInvoiceResponse> {
  const response = await axios.get<ISingleInvoiceResponse>(`/invoices/${id}`);
  return response.data;
}

export async function getInvoiceSummary(
  params: IQueryParams = {},
): Promise<IInvoiceSummaryResponse> {
  const response = await axios.get<IInvoiceSummaryResponse>(
    "/invoices/summary",
    {
      params: cleanObject(params),
    },
  );
  return response.data;
}

export async function getInvoiceSettings(): Promise<IInvoiceSettingsResponse> {
  const response =
    await axios.get<IInvoiceSettingsResponse>("/invoice-settings");
  return response.data;
}

export async function updateInvoiceSettings(
  payload: IInvoiceSettingsPayload,
): Promise<IInvoiceSettingsResponse> {
  const response = await axios.patch<IInvoiceSettingsResponse>(
    `/invoice-settings`,
    payload,
  );
  return response.data;
}

export async function createInvoice(
  payload: IInvoicePayload,
): Promise<ISaveInvoiceResponse> {
  const response = await axios.post<ISaveInvoiceResponse>("/invoices", payload);
  return response.data;
}

export async function updateInvoice(
  id: string,
  payload: IUpdateInvoicePayload,
): Promise<ISaveInvoiceResponse> {
  const response = await axios.patch<ISaveInvoiceResponse>(
    `/invoices/${id}`,
    payload,
  );
  return response.data;
}

export async function sendInvoice(id: string): Promise<IBaseResponse> {
  const response = await axios.post<IBaseResponse>(`/invoices/${id}/send`);
  return response.data;
}
