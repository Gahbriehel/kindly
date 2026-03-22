"use client";

import axios, { type AxiosError } from "axios";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { clearToken, setRedirectUrl } from "../store/slices/auth";
import { customToast } from "../helpers/customToast";
import { persistor, store } from "../store";
import { setOnline } from "../store/slices/network";
import { Toaster } from "react-hot-toast";
import {
  axiosErrorToast,
  INVALID_TOKEN_MESSAGES,
} from "../helpers/axiosErrorToast";
import { type ReactNode, type JSX, useEffect } from "react";
import { type IBaseResponse } from "../models/base";

interface Props {
  children: ReactNode;
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: Props): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function AxiosProvider({ children }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { online } = useAppSelector((state) => state.network);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      function (response) {
        if (!online) dispatch(setOnline(true));
        return response;
      },
      async function (error: AxiosError<IBaseResponse>) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message ?? "";
        const errorsList = errorData?.errors;

        if (INVALID_TOKEN_MESSAGES.includes(errorMessage)) {
          customToast.error("Session has expired");
          if (typeof window !== "undefined") {
            const currentUrl =
              window.location.pathname + window.location.search;
            dispatch(setRedirectUrl(currentUrl));
          }
          dispatch(clearToken());
          queryClient.clear();
        }
        if (error.request && !errorMessage && !errorsList?.length) {
          dispatch(setOnline(false));
          axiosErrorToast({
            message:
              "No response from server. Please check your internet connection.",
          });
        }
        const hasErrors = errorsList?.length;
        const hasMessage = errorMessage;

        if (hasErrors && hasMessage) {
          const combinedMessage = [errorMessage, ...errorsList].join("\n");
          axiosErrorToast({
            message: combinedMessage,
            errorCode: error.response?.status,
          });
        } else if (hasErrors) {
          axiosErrorToast({
            message: errorsList.join("\n"),
            errorCode: error.response?.status,
          });
        } else if (hasMessage) {
          axiosErrorToast({
            message: errorMessage,
            errorCode: error.response?.status,
          });
        } else {
          axiosErrorToast({ message: "An error occurred" });
        }
        return await Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch, online]);

  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_PROD_SERVER;
    axios.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : "";
    axios.defaults.headers.post["Content-Type"] = "application/json";
  }, [token]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: Props): JSX.Element {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>
  );
}

export function ToastProvider(): JSX.Element {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "#ffffff",
          color: "#374151",
          fontSize: "14px",
          fontWeight: "500",
          padding: "16px 20px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e7eb",
          maxWidth: "400px",
          fontFamily: "var(--font-inter)",
        },
        success: {
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            border: "1px solid #059669",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#10b981",
          },
        },
        error: {
          style: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#ffffff",
            border: "1px solid #dc2626",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#ef4444",
          },
        },
        loading: {
          style: {
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#ffffff",
            border: "1px solid #4f46e5",
          },
        },
      }}
    />
  );
}
