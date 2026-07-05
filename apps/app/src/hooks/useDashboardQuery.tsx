import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard";

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => await getDashboardStats(),
  });
}
