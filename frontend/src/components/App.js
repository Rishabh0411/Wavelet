import React, { useEffect, useMemo, useState } from "react";
import Homepage from "./Homepage";
import {
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const getThemeVars = (mode) =>
  mode === "dark"
    ? {
        "--wave-page-bg":
          "radial-gradient(circle at 15% 15%, rgba(255, 0, 128, 0.16), transparent 35%), radial-gradient(circle at 85% 25%, rgba(0, 229, 255, 0.18), transparent 35%), radial-gradient(circle at 50% 100%, rgba(124, 77, 255, 0.18), transparent 42%), linear-gradient(135deg, #0b1020 0%, #161b34 45%, #1b1140 100%)",
        "--wave-orb-1": "rgba(255, 0, 128, 0.22)",
        "--wave-orb-2": "rgba(0, 229, 255, 0.16)",
        "--wave-card-bg": "rgba(9, 14, 35, 0.58)",
        "--wave-card-border": "rgba(255,255,255,0.14)",
        "--wave-card-shadow": "0 14px 45px rgba(0,0,0,0.34)",
        "--wave-text-primary": "#f3f4f6",
        "--wave-text-secondary": "rgba(229, 231, 235, 0.82)",
        "--wave-outline-text": "#e5e7eb",
        "--wave-outline-border": "rgba(229, 231, 235, 0.5)",
        "--wave-outline-bg": "rgba(255,255,255,0.03)",
        "--wave-outline-border-hover": "rgba(229, 231, 235, 0.85)",
        "--wave-outline-bg-hover": "rgba(255,255,255,0.08)",
        "--wave-input-text": "#f3f4f6",
        "--wave-input-bg": "rgba(255,255,255,0.06)",
        "--wave-input-border": "rgba(229,231,235,0.35)",
        "--wave-input-border-hover": "rgba(229,231,235,0.65)",
        "--wave-input-label": "rgba(229, 231, 235, 0.8)",
        "--wave-input-helper": "rgba(229, 231, 235, 0.72)",
        "--wave-accent-gradient":
          "linear-gradient(90deg, #ff4da6 0%, #7c4dff 55%, #2f80ed 100%)",
        "--wave-accent-gradient-hover":
          "linear-gradient(90deg, #ff2d95 0%, #6f3cff 55%, #1e73e8 100%)",
        "--wave-accent-shadow": "0 8px 24px rgba(76, 29, 149, 0.45)",
        "--wave-accent-shadow-hover": "0 10px 28px rgba(76, 29, 149, 0.55)",
        "--wave-player-bg":
          "linear-gradient(130deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 52%, rgba(255,255,255,0.02) 100%)",
        "--wave-player-border": "rgba(229, 231, 235, 0.16)",
        "--wave-player-shadow": "0 16px 38px rgba(0, 0, 0, 0.32)",
        "--wave-player-cover-border": "rgba(229,231,235,0.26)",
        "--wave-player-control-bg": "rgba(255,255,255,0.1)",
        "--wave-player-control-text": "#e2e8f0",
        "--wave-player-chip-play-bg": "rgba(34, 197, 94, 0.18)",
        "--wave-player-chip-pause-bg": "rgba(148, 163, 184, 0.18)",
        "--wave-player-chip-play-text": "#86efac",
        "--wave-player-chip-pause-text": "#cbd5e1",
        "--wave-player-chip-border": "rgba(255,255,255,0.16)",
        "--wave-player-track-bg": "rgba(229,231,235,0.16)",
        "--wave-player-track-border": "rgba(255,255,255,0.08)",
        "--wave-player-track-tick": "rgba(255,255,255,0.08)",
      }
    : {
        "--wave-page-bg":
          "radial-gradient(circle at 18% 18%, rgba(255, 77, 166, 0.16), transparent 35%), radial-gradient(circle at 82% 22%, rgba(47, 128, 237, 0.16), transparent 35%), linear-gradient(135deg, #f6f9ff 0%, #eef3ff 50%, #f8f3ff 100%)",
        "--wave-orb-1": "rgba(255, 77, 166, 0.18)",
        "--wave-orb-2": "rgba(47, 128, 237, 0.16)",
        "--wave-card-bg": "rgba(255, 255, 255, 0.78)",
        "--wave-card-border": "rgba(15, 23, 42, 0.12)",
        "--wave-card-shadow": "0 12px 30px rgba(15,23,42,0.12)",
        "--wave-text-primary": "#0f172a",
        "--wave-text-secondary": "rgba(15, 23, 42, 0.72)",
        "--wave-outline-text": "#1f2937",
        "--wave-outline-border": "rgba(15, 23, 42, 0.24)",
        "--wave-outline-bg": "rgba(255,255,255,0.7)",
        "--wave-outline-border-hover": "rgba(15, 23, 42, 0.45)",
        "--wave-outline-bg-hover": "rgba(255,255,255,0.92)",
        "--wave-input-text": "#0f172a",
        "--wave-input-bg": "rgba(255,255,255,0.92)",
        "--wave-input-border": "rgba(15,23,42,0.2)",
        "--wave-input-border-hover": "rgba(15,23,42,0.35)",
        "--wave-input-label": "rgba(15, 23, 42, 0.68)",
        "--wave-input-helper": "rgba(15, 23, 42, 0.64)",
        "--wave-accent-gradient":
          "linear-gradient(90deg, #ff4da6 0%, #7c4dff 55%, #2f80ed 100%)",
        "--wave-accent-gradient-hover":
          "linear-gradient(90deg, #ff2d95 0%, #6f3cff 55%, #1e73e8 100%)",
        "--wave-accent-shadow": "0 8px 18px rgba(124,77,255,0.28)",
        "--wave-accent-shadow-hover": "0 10px 22px rgba(124,77,255,0.32)",
        "--wave-player-bg":
          "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(244,248,255,0.98) 100%)",
        "--wave-player-border": "rgba(15, 23, 42, 0.12)",
        "--wave-player-shadow": "0 14px 30px rgba(15,23,42,0.12)",
        "--wave-player-cover-border": "rgba(15,23,42,0.16)",
        "--wave-player-control-bg": "rgba(15,23,42,0.08)",
        "--wave-player-control-text": "#334155",
        "--wave-player-chip-play-bg": "rgba(34, 197, 94, 0.16)",
        "--wave-player-chip-pause-bg": "rgba(148, 163, 184, 0.2)",
        "--wave-player-chip-play-text": "#166534",
        "--wave-player-chip-pause-text": "#334155",
        "--wave-player-chip-border": "rgba(15,23,42,0.16)",
        "--wave-player-track-bg": "rgba(15,23,42,0.12)",
        "--wave-player-track-border": "rgba(15,23,42,0.12)",
        "--wave-player-track-tick": "rgba(15,23,42,0.08)",
      };

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("wavelet-theme-mode") || "dark");

  useEffect(() => {
    localStorage.setItem("wavelet-theme-mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#7c4dff" },
          secondary: { main: "#ff4da6" },
          background:
            mode === "dark"
              ? { default: "#0b1020", paper: "rgba(9, 14, 35, 0.58)" }
              : { default: "#f6f9ff", paper: "rgba(255,255,255,0.8)" },
        },
        typography: {
          fontFamily: "Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", ...getThemeVars(mode) }}>
        <Box sx={{ position: "fixed", top: 14, right: 14, zIndex: 1400 }}>
          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              onClick={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))}
              sx={{
                color: "var(--wave-text-primary)",
                border: "1px solid var(--wave-card-border)",
                backgroundColor: "var(--wave-card-bg)",
                backdropFilter: "blur(8px)",
              }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Homepage />
      </Box>
    </ThemeProvider>
  );
}
