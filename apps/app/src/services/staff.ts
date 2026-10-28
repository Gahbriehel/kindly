import axios from "axios";
import type { IStaffListResponse } from "../models/staff";

export async function getStaff(): Promise<IStaffListResponse> {
  const response = await axios.get<IStaffListResponse>("/staff");
  return response.data;
}
