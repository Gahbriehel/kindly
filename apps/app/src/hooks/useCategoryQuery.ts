import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categories";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });
}
