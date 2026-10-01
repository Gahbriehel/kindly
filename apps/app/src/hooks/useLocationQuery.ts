import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../services/locations";

export const COUNTRIES_QUERY_KEY = ["locations", "countries"];

export function useCountriesQuery() {
  return useQuery({
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: async () => await getCountries(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
}
