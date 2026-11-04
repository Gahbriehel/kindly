import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelMessage,
  confirmMessage,
  initiateWhatsappMessage,
} from "../services/messages";
import type { IWhatsappMessagePayload } from "../models/message";
import { MESSAGES_KEY } from "./useMessagesQuery";

function useInvalidateMessages() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
}

export function useInitiateWhatsappMessage() {
  const invalidate = useInvalidateMessages();
  return useMutation({
    mutationFn: (payload: IWhatsappMessagePayload) =>
      initiateWhatsappMessage(payload),
    onSuccess: invalidate,
  });
}

export function useConfirmMessage() {
  const invalidate = useInvalidateMessages();
  return useMutation({
    mutationFn: (id: string) => confirmMessage(id),
    onSuccess: invalidate,
  });
}

export function useCancelMessage() {
  const invalidate = useInvalidateMessages();
  return useMutation({
    mutationFn: (id: string) => cancelMessage(id),
    onSuccess: invalidate,
  });
}
