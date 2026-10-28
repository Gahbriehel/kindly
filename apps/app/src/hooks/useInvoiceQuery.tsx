import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import {
  getInvoices,
  getInvoice,
  getInvoiceSummary,
  getInvoiceSettings,
  updateInvoiceSettings,
  createInvoice,
  updateInvoice,
  sendInvoice,
  recordInvoicePayment,
  voidInvoice,
  deleteInvoice,
} from "../services/invoice";
import {
  IInvoicePayload,
  IInvoicePaymentPayload,
  IInvoiceSettingsPayload,
  IUpdateInvoicePayload,
} from "../models/invoice";

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

function invalidateInvoiceQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: ["invoices"] });
  queryClient.invalidateQueries({ queryKey: ["invoices-summary"] });
  queryClient.invalidateQueries({ queryKey: ["invoice"] });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IInvoicePayload) => createInvoice(payload),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateInvoicePayload;
    }) => updateInvoice(id, payload),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendInvoice(id),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  });
}

export function useRecordInvoicePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IInvoicePaymentPayload;
    }) => recordInvoicePayment(id, payload),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  });
}

export function useVoidInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voidInvoice(id),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: (_, id) => {
      // Drop rather than refetch the detail, which would 404.
      queryClient.removeQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-summary"] });
    },
  });
}
