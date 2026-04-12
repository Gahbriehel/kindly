"use client";

import {
  QueryProvider,
  ReduxProvider,
  AxiosProvider,
  ToastProvider,
} from "./Providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AxiosProvider>
          {children}
          <ToastProvider />
        </AxiosProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
