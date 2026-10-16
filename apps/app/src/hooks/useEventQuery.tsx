import { useQuery } from "@tanstack/react-query";
import { IQueryParams } from "../models/base";
import { getEvents } from "../services/events";

export function useEventsQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: ["events", { ...params }],
    queryFn: async () => await getEvents(params),
  });
}
