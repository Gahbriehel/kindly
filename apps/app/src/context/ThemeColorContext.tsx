"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeColor = "pink" | "sky";

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(
  undefined,
);

function getInitialTheme(): ThemeColor {
  if (typeof window === "undefined") return "pink";
  const saved = localStorage.getItem("profile-theme-color");
  return saved === "pink" || saved === "sky" ? saved : "pink";
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] =
    useState<ThemeColor>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (themeColor === "sky") {
      root.classList.add("theme-sky");
      root.classList.remove("theme-pink");
    } else {
      root.classList.add("theme-pink");
      root.classList.remove("theme-sky");
    }
  }, [themeColor]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem("profile-theme-color", color);
  };

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider");
  }
  return context;
}
