import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IQueryParams } from "../models/base";
import type { IEventPayload } from "../models/event";
import { createEvent, getCalendarEvents, getEvents } from "../services/events";

export function useEventsQuery(params: IQueryParams = {}) {
  return useQuery({
    queryKey: ["events", { ...params }],
    queryFn: async () => await getEvents(params),
  });
}

/** Every occurrence between `start` and `end` (inclusive `YYYY-MM-DD`). */
export function useCalendarEventsQuery(params: {
  start: string;
  end: string;
  categoryId?: string;
}) {
  return useQuery({
    queryKey: ["events", "calendar", { ...params }],
    queryFn: async () => await getCalendarEvents(params),
    placeholderData: keepPreviousData,
  });
}

export function useAddEvent({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IEventPayload) => createEvent(payload),
    onSuccess: () => {
      // Covers the dashboard list and every calendar window.
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess?.();
    },
  });
}
