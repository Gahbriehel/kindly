import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../services/staff";

export function useStaffQuery() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => await getStaff(),
  });
}
