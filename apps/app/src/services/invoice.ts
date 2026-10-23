import axios from "axios";
import type { IQueryParams } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type {
  IInvoiceResponse,
  ISingleInvoiceResponse,
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
