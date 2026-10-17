import { useQuery } from "@tanstack/react-query";
import { getCurrentSubscription } from "../services/subscription";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { updateClientLimit } from "../store/slices/auth";

export const SUBSCRIPTION_CURRENT_KEY = ["subscription", "current"];

export function useCurrentSubscriptionQuery() {
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: SUBSCRIPTION_CURRENT_KEY,
    queryFn: async () => {
      const res = await getCurrentSubscription();
      const limit = res?.data?.client_limit || res?.client_limit;
      if (limit) {
        dispatch(updateClientLimit(limit));
      }
      return res;
    },
    enabled: !!accessToken || !!user,
    staleTime: 1000 * 30,
  });
}
