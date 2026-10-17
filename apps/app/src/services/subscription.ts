import axios from "axios";
import type { IBaseResponse } from "../models/base";
import type { IClientLimit } from "../models/auth";

export interface ICurrentSubscription {
  client_limit?: IClientLimit;
  subscriptionTier?: string;
  subscriptionActive?: boolean;
  subscriptionStartAt?: string;
  subscriptionEndAt?: string;
  [key: string]: unknown;
}

export interface ICurrentSubscriptionResponse extends IBaseResponse {
  data: ICurrentSubscription;
  client_limit?: IClientLimit;
}

export async function getCurrentSubscription(): Promise<ICurrentSubscriptionResponse> {
  try {
    const response = await axios.get<ICurrentSubscriptionResponse>(
      "/subscriptions/current",
    );
    return response.data;
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;
    if (axiosError?.response?.status === 404) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = await axios.get<any>("/auth/me");
      const user = fallback.data?.data?.user || fallback.data?.data;
      return {
        ...fallback.data,
        data: {
          client_limit: user?.client_limit,
          subscriptionTier: user?.company?.subscriptionTier,
          ...user,
        },
        client_limit: user?.client_limit,
      };
    }
    throw error;
  }
}
