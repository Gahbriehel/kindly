import axios from "axios";
import type { ICategoryPayload, ICategoryResponse } from "../models/categories";

export async function getCategories(): Promise<ICategoryResponse> {
  const response = await axios.get<ICategoryResponse>("/categories");
  return response.data;
}

export async function addCategory(
  payload: ICategoryPayload,
): Promise<ICategoryResponse> {
  const response = await axios.post<ICategoryResponse>("/categories", payload);
  return response.data;
}

export async function updateCategory(
  id: string,
  payload: ICategoryPayload,
): Promise<ICategoryResponse> {
  const response = await axios.patch<ICategoryResponse>(
    `/categories/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteCategory(id: string): Promise<ICategoryResponse> {
  const response = await axios.delete<ICategoryResponse>(`/categories/${id}`);
  return response.data;
}
