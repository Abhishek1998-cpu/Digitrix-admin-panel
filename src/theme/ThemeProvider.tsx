import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";
import { ColorModeProvider } from "./ColorModeProvider";
import { useColorMode } from "./colorMode";

const sharedOptions = {
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    overline: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
} as const;

function ThemeInner({ children }: { children: ReactNode }) {
  const { mode } = useColorMode();
  const theme = createTheme({
    ...sharedOptions,
    palette: {
      mode,
      primary: {
        main: "#0f87ff",
      },
      secondary: {
        main: "#6366F1",
      },
      ...(mode === "dark"
        ? {
            background: {
              default: "#0a0c10",
              paper: "rgba(15, 20, 28, 0.9)",
            },
            text: {
              primary: "#f8fafc",
              secondary: "rgba(248, 250, 252, 0.7)",
            },
            divider: "rgba(255, 255, 255, 0.08)",
          }
        : {}),
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MUIThemeProvider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ColorModeProvider>
      <ThemeInner>{children}</ThemeInner>
    </ColorModeProvider>
  );
}
