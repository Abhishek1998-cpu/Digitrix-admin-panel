import { useMemo, useState, useEffect, type ReactNode } from "react";
import { ColorModeContext, getInitialMode, type ColorMode } from "./colorMode";

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem("admin-panel-color-mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}
