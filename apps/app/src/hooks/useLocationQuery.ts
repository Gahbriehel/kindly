import { useQuery } from "@tanstack/react-query";
import { getCountries, getIndustries } from "../services/locations";

export const COUNTRIES_QUERY_KEY = ["locations", "countries"];
export const INDUSTRIES_QUERY_KEY = ["locations", "industries"];

export function useCountriesQuery() {
  return useQuery({
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: async () => await getCountries(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
}

export function useIndustriesQuery() {
  return useQuery({
    queryKey: INDUSTRIES_QUERY_KEY,
    queryFn: async () => await getIndustries(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
}
