import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { type IBaseResponse } from "../models/base";

// Make customToast available globally for offline error handling
interface CustomToast {
  success: (message: string) => string | number;
  error: (message: string) => string | number;
  loading: (message: string) => string | number;
}

declare global {
  interface Window {
    customToast?: CustomToast;
  }
}

if (typeof window !== "undefined") {
  window.customToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
  };
}

const toastConfig = {
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
  },
  position: "top-right" as const,
};

const successConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "1px solid #059669",
  },
  iconTheme: {
    primary: "#ffffff",
    secondary: "#10b981",
  },
};

const errorConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
    border: "1px solid #dc2626",
  },
  iconTheme: {
    primary: "#ffffff",
    secondary: "#ef4444",
  },
};

const infoConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "1px solid #2563eb",
  },
  icon: "💡",
};

const warningConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#ffffff",
    border: "1px solid #d97706",
  },
  icon: "⚠️",
};

const loadingConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#ffffff",
    border: "1px solid #4f46e5",
  },
};

export const customToast = {
  success: (message: string, id?: string) =>
    toast.success(message, {
      id: id ?? encodeURI(message),
      ...successConfig,
    }),

  error: (message: string, id?: string) =>
    toast.error(message, {
      id: id ?? encodeURI(message),
      ...errorConfig,
    }),

  info: (message: string, id?: string) =>
    toast(message, {
      id: id ?? encodeURI(message),
      ...infoConfig,
    }),

  warning: (message: string, id?: string) =>
    toast(message, {
      id: id ?? encodeURI(message),
      ...warningConfig,
    }),

  loading: (message: string, id?: string) =>
    toast.loading(message, {
      id: id ?? encodeURI(message),
      ...loadingConfig,
    }),

  promise: async <T extends object>(
    fn: Promise<T | IBaseResponse>,
    loadingText?: string,
    successText?: string,
  ) => {
    const toastId = loadingText ?? "promise-toast";

    try {
      customToast.loading(loadingText ?? "Processing...", toastId);
      const response = await fn;

      const message =
        "message" in response
          ? capitalizeFirstLetter(response.message)
          : (successText ?? "Operation completed successfully!");

      customToast.dismiss(toastId);
      customToast.success(message);

      return response;
    } catch (error) {
      customToast.dismiss(toastId);
      customToast.error(error as string);
    }
  },

  dismiss: (id?: string) => {
    toast.dismiss(id);
  },

  dismissAll: () => {
    toast.dismiss();
  },

  custom: (
    message: string,
    options?: {
      icon?: string;
      duration?: number;
      style?: Record<string, string>;
      id?: string;
    },
  ) =>
    toast(message, {
      id: options?.id ?? encodeURI(message),
      icon: options?.icon,
      duration: options?.duration ?? toastConfig.duration,
      style: {
        ...toastConfig.style,
        ...options?.style,
      },
    }),
};
