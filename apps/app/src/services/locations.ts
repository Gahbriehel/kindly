import axios from "axios";
import { ICountriesResponse } from "../models/locations";

export async function getCountries() {
  const response = await axios.get<ICountriesResponse>(`/locations/countries`);
  return response.data;
}
