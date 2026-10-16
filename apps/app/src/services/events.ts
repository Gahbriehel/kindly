import axios from "axios";
import { cleanObject } from "../helpers/cleanObject";
import { IQueryParams } from "../models/base";
import { IEventResponse } from "../models/event";

export async function getEvents(
  params: IQueryParams = {},
): Promise<IEventResponse> {
  const response = await axios.get<IEventResponse>("/events", {
    params: cleanObject(params),
  });
  return response.data;
}
