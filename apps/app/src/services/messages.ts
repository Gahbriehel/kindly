import axios from "axios";
import { cleanObject } from "../helpers/cleanObject";
import type {
  IMessageLogResponse,
  IMessagesQueryParams,
  IMessagesResponse,
  IWhatsappMessagePayload,
} from "../models/message";

export async function getMessages(
  params: IMessagesQueryParams,
): Promise<IMessagesResponse> {
  const response = await axios.get<IMessagesResponse>("/messages", {
    params: cleanObject(params),
  });
  return response.data;
}

export async function initiateWhatsappMessage(
  payload: IWhatsappMessagePayload,
): Promise<IMessageLogResponse> {
  const response = await axios.post<IMessageLogResponse>(
    "/messages/whatsapp",
    payload,
  );
  return response.data;
}

export async function confirmMessage(id: string): Promise<IMessageLogResponse> {
  const response = await axios.patch<IMessageLogResponse>(
    `/messages/${id}/confirm`,
  );
  return response.data;
}

export async function cancelMessage(id: string): Promise<IMessageLogResponse> {
  const response = await axios.patch<IMessageLogResponse>(
    `/messages/${id}/cancel`,
  );
  return response.data;
}
