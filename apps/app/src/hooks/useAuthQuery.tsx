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
      dispatch(setToken(response.data.token));
      dispatch(
        setUser({
          id: response.data.id,
          username: response.data.username,
          role: response.data.role,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          city: response.data.city,
          address: response.data.address,
          country: response.data.country,
          companyName: response.data.companyName,
        }),
      );
      customToast.success(response.responseMessage);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ responseMessage: string }>) => {
      customToast.error(error.response?.data.responseMessage ?? error.message);
    },
  });
}

export function useSignupMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      customToast.success(response.responseMessage);
      router.push("/login");
    },
    onError: (error: AxiosError<{ responseMessage: string }>) => {
      customToast.error(error.response?.data.responseMessage ?? error.message);
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
