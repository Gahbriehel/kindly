import axios from "axios";
import type { IQueryParams } from "../models/base";
import { cleanObject } from "../helpers/cleanObject";
import type { ITemplateResponse } from "../models/template";

export async function getTemplates(
  params: IQueryParams,
): Promise<ITemplateResponse> {
  const response = await axios.get<ITemplateResponse>("/templates", {
    params: cleanObject(params),
  });
  return response.data;
}
