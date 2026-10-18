import axios from "axios";
import { cleanObject } from "../helpers/cleanObject";
import { IBaseResponse, IQueryParams } from "../models/base";
import {
  ICalendarEventsResponse,
  IEventCreateResponse,
  IEventPayload,
  IEventResponse,
  IUpdateEventPayload,
} from "../models/event";

export async function getEvents(
  params: IQueryParams = {},
): Promise<IEventResponse> {
  const response = await axios.get<IEventResponse>("/events", {
    params: cleanObject(params),
  });
  return response.data;
}

export async function getCalendarEvents(
  params: Pick<IQueryParams, "start" | "end" | "categoryId">,
): Promise<ICalendarEventsResponse> {
  const response = await axios.get<ICalendarEventsResponse>(
    "/events/calendar",
    { params: cleanObject(params) },
  );
  return response.data;
}

export async function getEvent(id: string): Promise<IEventCreateResponse> {
  const response = await axios.get<IEventCreateResponse>(`/events/${id}`);
  return response.data;
}

export async function createEvent(
  payload: IEventPayload,
): Promise<IEventCreateResponse> {
  const response = await axios.post<IEventCreateResponse>("/events", payload);
  return response.data;
}

export async function updateEvent(
  id: string,
  payload: IUpdateEventPayload,
): Promise<IEventCreateResponse> {
  const response = await axios.patch<IEventCreateResponse>(
    `/events/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteEvent(id: string): Promise<IBaseResponse> {
  const response = await axios.delete<IBaseResponse>(`/events/${id}`);
  return response.data;
}
