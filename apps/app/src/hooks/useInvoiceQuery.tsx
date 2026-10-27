import { useQuery } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import {
  getInvoices,
  getInvoice,
  getInvoiceSummary,
  getInvoiceSettings,
} from "../services/invoice";

export function useInvoicesQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: ["invoices", { ...params }],
    queryFn: () => getInvoices(params),
  });
}

export function useInvoiceQuery(id?: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id!),
    enabled: !!id,
  });
}

export function useInvoiceSummaryQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: ["invoices-summary", { ...params }],
    queryFn: () => getInvoiceSummary(params),
  });
}

export function useInvoiceSettingsQuery() {
  return useQuery({
    queryKey: ["invoice-settings"],
    queryFn: getInvoiceSettings,
  });
}
