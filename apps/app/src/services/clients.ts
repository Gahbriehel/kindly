import axios from "axios";
import type { IQueryParams, IBaseResponse } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type {
  IClientResponse,
  ISingleClientResponse,
  ICreateClientPayload,
  IUpdateClientPayload,
} from "../models/client";

export async function getClients(
  params: IQueryParams = {},
): Promise<IClientResponse> {
  const response = await axios.get<IClientResponse>("/clients", {
    params: cleanObject(params),
  });
  return response.data;
}

export async function getClient(id: string): Promise<ISingleClientResponse> {
  const response = await axios.get<ISingleClientResponse>(`/clients/${id}`);
  return response.data;
}

export async function createClient(
  payload: ICreateClientPayload,
): Promise<ISingleClientResponse | IClientResponse> {
  const response = await axios.post<ISingleClientResponse | IClientResponse>(
    "/clients",
    payload,
  );
  return response.data;
}

export async function updateClient(
  id: string,
  payload: IUpdateClientPayload,
): Promise<ISingleClientResponse> {
  const response = await axios.patch<ISingleClientResponse>(
    `/clients/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteClient(id: string): Promise<IBaseResponse> {
  const response = await axios.delete<IBaseResponse>(`/clients/${id}`);
  return response.data;
}
