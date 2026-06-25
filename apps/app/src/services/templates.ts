import axios from "axios";
import type { IQueryParams, IBaseResponse } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type { ITemplateResponse, ITemplatePayload } from "../models/template";

export async function getTemplates(
  params: IQueryParams,
): Promise<ITemplateResponse> {
  const response = await axios.get<ITemplateResponse>("/templates", {
    params: cleanObject(params),
  });
  return response.data;
}

export async function createTemplate(
  payload: ITemplatePayload,
): Promise<ITemplateResponse> {
  const response = await axios.post<ITemplateResponse>("/templates", payload);
  return response.data;
}

export async function updateTemplate(
  id: string,
  payload: Partial<ITemplatePayload>,
): Promise<ITemplateResponse> {
  const response = await axios.patch<ITemplateResponse>(
    `/templates/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteTemplate(id: string): Promise<IBaseResponse> {
  const response = await axios.delete<IBaseResponse>(`/templates/${id}`);
  return response.data;
}
