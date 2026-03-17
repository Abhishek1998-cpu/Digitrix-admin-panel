import { createContext, useContext } from "react";

const STORAGE_KEY = "admin-panel-color-mode";

export type ColorMode = "light" | "dark";

export interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

export function getInitialMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (ctx === undefined) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return ctx;
}
