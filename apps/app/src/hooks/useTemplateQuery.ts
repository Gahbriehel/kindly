import { useQuery } from "@tanstack/react-query";
import type { IQueryParams } from "../models/base";
import { getTemplates } from "../services/templates";

export function useTemplatesQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: ["templates", { ...params }],
    queryFn: async () => await getTemplates(params),
  });
}
