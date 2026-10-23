import { useQuery } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import { getInvoices, getInvoice } from "../services/invoice";

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
