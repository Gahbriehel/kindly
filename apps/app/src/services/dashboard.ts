import axios from "axios";
import type { IDashboardResponse } from "../models/dashboard";

export async function getDashboardStats(): Promise<IDashboardResponse> {
  const response = await axios.get<IDashboardResponse>(`/dashboard`);
  return response.data;
}
