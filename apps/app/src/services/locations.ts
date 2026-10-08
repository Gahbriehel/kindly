import axios from "axios";
import { ICountriesResponse, IIndustriesResponse } from "../models/locations";

export async function getCountries() {
  const response = await axios.get<ICountriesResponse>(`/locations/countries`);
  return response.data;
}

export async function getIndustries() {
  const response = await axios.get<IIndustriesResponse>(
    `/locations/industries`,
  );
  return response.data;
}
