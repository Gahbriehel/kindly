import { useMutation } from "@tanstack/react-query";
import {
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
      dispatch(setToken(response.accessToken));
      dispatch(
        setUser({
          id: response.user.id,
          role: response.user.role,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phoneNumber: response.user.phoneNumber,
          companyName: response.user.companyName,
          address: response.user.address,
          city: response.user.city,
          country: response.user.country,
          avatarUrl: response.user.avatarUrl,
          isActive: response.user.isActive,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
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
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      customToast.success(response.message);
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      customToast.error(error.response?.data.message ?? "Signup failed");
    },
  });
}

// export function useForgotPasswordMutation() {
//   const router = useRouter();
//   return useMutation({
//     mutationFn: forgotPassword,
//     onSuccess: () => {
//       customToast.success("Mail sent. Check your inbox!");
//       router.push("/reset-password");
//     },
//     onError: () => {},
//     onSettled: () => {},
//   });
// }
