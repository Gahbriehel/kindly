import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import type { IMessagesQueryParams } from "../models/message";

export const MESSAGES_KEY = "messages";

export function useMessagesQuery(
  params: IMessagesQueryParams = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [MESSAGES_KEY, { ...params }],
    queryFn: async () => await getMessages(params),
    placeholderData: keepPreviousData,
    enabled,
    // Emails move QUEUED -> SENT/FAILED in the background; poll until settled.
    refetchInterval: (query) =>
      query.state.data?.data.some((m) => m.status === "QUEUED") ? 3000 : false,
  });
}
