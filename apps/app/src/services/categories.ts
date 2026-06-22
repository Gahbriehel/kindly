import axios from "axios";
import type { ICategoryResponse } from "../models/categories";

export async function getCategories(): Promise<ICategoryResponse> {
  const response = await axios.get<ICategoryResponse>("/categories");
  return response.data;
}
