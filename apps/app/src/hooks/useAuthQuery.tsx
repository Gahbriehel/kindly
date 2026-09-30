import { useMutation } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  signup,
  updateIndividualProfile,
} from "@/src/services/auth";
import { IUpdatePasswordPayload, IUserData } from "@/src/models/auth";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { setUser, setToken, logOut } from "@/src/store/slices/auth";
import { customToast } from "@/src/helpers/customToast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAppSelector } from "./useAppSelector";
import { queryClient } from "../utils/Providers";

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
      const message = error.response?.data?.message;
      if (message !== "You already have an active session on another device.") {
        customToast.error(message ?? "Login failed");
      }
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

export function useChangePasswordMutation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  return useMutation({
    mutationFn: (data: Omit<IUpdatePasswordPayload, "token">) =>
      changePassword({
        ...data,
        token: accessToken ?? "",
      }),
    onSuccess: (response) => {
      customToast.success(response.message);
      dispatch(logOut());
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(
        error.response?.data.message ?? "Change password failed",
      );
    },
  });
}

export function useUpdateProfileMutation() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: updateIndividualProfile,
    onSuccess: (response) => {
      customToast.success(response.message || "Profile updated successfully");
      dispatch(
        setUser({
          ...user,
          ...response.data.individual,
        } as IUserData),
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(
        error.response?.data.message ?? "Failed to update profile",
      );
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (response) => {
      dispatch(logOut());
      queryClient.clear();
      router.push("/login");
      customToast.success(response?.message || "Logged out successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(error.response?.data.message ?? "Logout failed");
      dispatch(logOut());
      queryClient.clear();
      router.push("/login");
    },
  });
}
