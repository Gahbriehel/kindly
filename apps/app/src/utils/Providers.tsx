"use client";

import axios, { type AxiosError } from "axios";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { logOut, setRedirectUrl, setTokens } from "../store/slices/auth";
import { customToast } from "../helpers/customToast";
import { persistor, store } from "../store";
import { Toaster } from "react-hot-toast";
import { axiosErrorToast } from "../helpers/axiosErrorToast";
import { type ReactNode, type JSX, useEffect } from "react";
import { type IBaseResponse } from "../models/base";
import { refreshTokenRequest } from "../services/auth";

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

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_PROD_SERVER;
axios.defaults.headers.post["Content-Type"] = "application/json";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (tokens: { accessToken: string; refreshToken: string }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error: any) => void;
}> = [];

const processQueue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  tokens: { accessToken: string; refreshToken: string } | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(tokens!);
    }
  });
  failedQueue = [];
};

export function AxiosProvider({ children }: Props): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error: AxiosError<IBaseResponse>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalRequest = error.config as any;
        const errorData = error.response?.data;
        const errorMessage = errorData?.message ?? "";
        const errorsList = errorData?.errors;

        const isLoginRequest = originalRequest?.url?.includes("/auth/login");
        const isRefreshRequest =
          originalRequest?.url?.includes("/auth/refresh");

        if (
          error.response?.status === 401 &&
          !isLoginRequest &&
          !isRefreshRequest &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            return (
              new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((tokens: any) => {
                  originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                  return axios(originalRequest);
                })
                .catch((err) => Promise.reject(err))
            );
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const state = store.getState();
          const refreshToken = state.auth.refreshToken;

          if (refreshToken) {
            try {
              const response = await refreshTokenRequest(refreshToken);
              const { tokens } = response.data;
              dispatch(setTokens(tokens));
              processQueue(null, tokens);
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              processQueue(refreshError, null);
              customToast.error("Session has expired");
              if (typeof window !== "undefined") {
                const currentUrl =
                  window.location.pathname + window.location.search;
                dispatch(setRedirectUrl(currentUrl));
              }
              dispatch(logOut());
              queryClient.clear();
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          } else {
            customToast.error("Session has expired");
            if (typeof window !== "undefined") {
              const currentUrl =
                window.location.pathname + window.location.search;
              dispatch(setRedirectUrl(currentUrl));
            }
            dispatch(logOut());
            queryClient.clear();
            return Promise.reject(error);
          }
        }

        if (!error.response && error.request) {
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
          // axiosErrorToast({ message: "An error occurred" });
        }
        return await Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

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
