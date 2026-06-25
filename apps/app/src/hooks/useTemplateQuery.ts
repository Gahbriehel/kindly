import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../services/templates";
import type { ITemplatePayload } from "../models/template";

const TEMPLATES_KEY = "templates";

export function useTemplatesQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: [TEMPLATES_KEY, { ...params }],
    queryFn: async () => await getTemplates(params),
  });
}

interface MutationProps {
  onSuccess?: () => void;
}

export function useAddTemplate({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ITemplatePayload) => createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      onSuccess?.();
    },
  });
}

export function useUpdateTemplate({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ITemplatePayload>;
    }) => updateTemplate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      onSuccess?.();
    },
  });
}

export function useDeleteTemplate({ onSuccess }: MutationProps = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      onSuccess?.();
    },
  });
}
