import axios from "axios";
import type { IQueryParams } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type {
  IInvoiceResponse,
  ISingleInvoiceResponse,
  IInvoiceSummaryResponse,
  IInvoiceSettingsResponse,
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
