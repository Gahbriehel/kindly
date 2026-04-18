import { useMutation } from "@tanstack/react-query";
import {
  // forgotPassword,
  login,
  signup,
} from "@/src/app/services/auth";
import { useAppDispatch } from "@/src/app/hooks/useAppDispatch";
import { setUser, setToken } from "@/src/app/store/slices/auth";
import { customToast } from "@/src/app/helpers/customToast";
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
          username: response.data.username,
          role: response.data.role,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        }),
      );
      customToast.success(response.responseMessage);
      router.push("/app");
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
