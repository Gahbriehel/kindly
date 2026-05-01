"use client";

import {
  QueryProvider,
  ReduxProvider,
  AxiosProvider,
  ToastProvider,
} from "./Providers";
import { ThemeColorProvider } from "../context/ThemeColorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeColorProvider>
      <ReduxProvider>
        <QueryProvider>
          <AxiosProvider>
            {children}
            <ToastProvider />
          </AxiosProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeColorProvider>
  );
}
