import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import {
  getInvoices,
  getInvoice,
  getInvoiceSummary,
  getInvoiceSettings,
  updateInvoiceSettings,
} from "../services/invoice";
import { IInvoiceSettingsPayload } from "../models/invoice";

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

export function useUpdateInvoiceSettings({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IInvoiceSettingsPayload) =>
      updateInvoiceSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-settings"] });
      onSuccess?.();
    },
  });
}
