"use client";

import {
  QueryProvider,
  ReduxProvider,
  AxiosProvider,
  ToastProvider,
} from "./Providers";
import { ThemeProvider } from "../context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <QueryProvider>
          <AxiosProvider>
            {children}
            <ToastProvider />
          </AxiosProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
