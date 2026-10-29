import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IQueryParams } from "../models/base";
import type {
  IEventCreateResponse,
  IEventPayload,
  IUpdateEventPayload,
} from "../models/event";
import {
  createEvent,
  deleteEvent,
  getCalendarEvents,
  getEvent,
  getEvents,
  updateEvent,
} from "../services/events";

export function useEventsQuery(
  params: IQueryParams = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["events", { ...params }],
    queryFn: async () => await getEvents(params),
    enabled,
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

export function useEventQuery(id?: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => (id ? await getEvent(id) : null),
    enabled: !!id,
  });
}

function invalidateEventQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: ["events"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["clients"] });
}

export function useAddEvent({
  onSuccess,
}: { onSuccess?: (response: IEventCreateResponse) => void } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IEventPayload) => createEvent(payload),
    onSuccess: (response) => {
      invalidateEventQueries(queryClient);
      onSuccess?.(response);
    },
  });
}

export function useUpdateEvent({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateEventPayload;
    }) => updateEvent(id, payload),
    onSuccess: () => {
      invalidateEventQueries(queryClient);
      onSuccess?.();
    },
  });
}

export function useDeleteEvent({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      invalidateEventQueries(queryClient);
      onSuccess?.();
    },
  });
}
