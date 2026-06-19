import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getProfile,
  // forgotPassword,
  login,
  signup,
} from "@/src/services/auth";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { setUser, setToken } from "@/src/store/slices/auth";
import { customToast } from "@/src/helpers/customToast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useLoginMutation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const { accessToken, individual } = response.data;
      dispatch(setToken(accessToken));
      dispatch(
        setUser({
          id: individual.id,
          role: "individual" as never,
          firstName: individual.firstName,
          lastName: individual.lastName,
          email: individual.email,
          phoneNumber: individual.phoneNumber,
          companyName: null,
          address: individual.address,
          city: individual.city,
          country: individual.country,
          avatarUrl: individual.avatarUrl,
          isActive: individual.isActive,
          subscriptionTier: individual.subscriptionTier,
          createdAt: individual.createdAt,
          updatedAt: individual.updatedAt,
        }),
      );
      customToast.success(response.message);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(error.response?.data.message ?? "Login failed");
    },
  });
}

export function useSignupMutation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      const { accessToken, individual } = response.data;
      dispatch(setToken(accessToken));
      dispatch(
        setUser({
          id: individual.id,
          role: "individual" as never,
          firstName: individual.firstName,
          lastName: individual.lastName,
          email: individual.email,
          phoneNumber: individual.phoneNumber,
          companyName: null,
          address: individual.address,
          city: individual.city,
          country: individual.country,
          avatarUrl: individual.avatarUrl,
          isActive: individual.isActive,
          subscriptionTier: individual.subscriptionTier,
          createdAt: individual.createdAt,
          updatedAt: individual.updatedAt,
        }),
      );
      customToast.success(response.message);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error:", error);
      customToast.error(error.response?.data.message ?? "Signup failed");
    },
  });
}

export function useForgotPasswordMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      customToast.success(response.message);
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(
        error.response?.data.message ?? "Mail sent. Check your inbox!",
      );
    },
  });
}

export function useGetProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => await getProfile(),
  });
}
