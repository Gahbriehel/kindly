import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getTags,
} from "../services/clients";
import type {
  ICreateClientPayload,
  IUpdateClientPayload,
} from "../models/client";

const CLIENTS_KEY = "clients";
const TAGS_KEY = "client-tags";

export function useClientsQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: [CLIENTS_KEY, { ...params }],
    queryFn: async () => await getClients(params),
  });
}

export function useClientQuery(id: string) {
  return useQuery({
    queryKey: [CLIENTS_KEY, id],
    queryFn: async () => await getClient(id),
    enabled: !!id,
  });
}

export function useTagsQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: [TAGS_KEY, { ...params }],
    queryFn: async () => await getTags(params),
    placeholderData: keepPreviousData,
  });
}

interface MutationProps {
  onSuccess?: () => void;
}

export function useAddClient({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateClientPayload) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
      onSuccess?.();
    },
  });
}

export function useUpdateClient({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateClientPayload;
    }) => updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
      onSuccess?.();
    },
  });
}

export function useDeleteClient({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] });
      onSuccess?.();
    },
  });
}
